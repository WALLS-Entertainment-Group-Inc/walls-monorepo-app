import { createClient } from "@walls/supabase/server";

import { META_PROVIDER } from "@/lib/connections";

export type CampaignEntityType = "campaign" | "ad_group" | "ad";

export type EntityPerformanceRow = {
  id: string;
  entityType: CampaignEntityType;
  name: string;
  status: string | null;
  objective: string | null;
  accountName: string;
  parentName: string | null;
  userConnectionId: string;
  spendMicros: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  roas: number | null;
  lastSyncedAt: string | null;
};

export type CampaignAccountOption = {
  id: string;
  name: string;
  userConnectionId: string;
};

export type CampaignsListResult = {
  rows: EntityPerformanceRow[];
  totalCount: number;
  accounts: CampaignAccountOption[];
  syncing: boolean;
};

const PAGE_SIZE_DEFAULT = 25;

type EntityRecord = {
  id: string;
  entity_type: CampaignEntityType;
  name: string | null;
  status: string | null;
  objective: string | null;
  parent_id: string | null;
  user_connection_id: string;
  last_synced_at: string | null;
};

type MetricRecord = {
  entity_id: string;
  spend_micros: number;
  impressions: number;
  clicks: number;
  conversions: number;
  conversion_value_micros: number;
};

function aggregateMetrics(rows: MetricRecord[]) {
  const totals = {
    spend_micros: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    conversion_value_micros: 0,
  };

  for (const row of rows) {
    totals.spend_micros += row.spend_micros ?? 0;
    totals.impressions += row.impressions ?? 0;
    totals.clicks += row.clicks ?? 0;
    totals.conversions += Number(row.conversions ?? 0);
    totals.conversion_value_micros += row.conversion_value_micros ?? 0;
  }

  const spend = totals.spend_micros / 1_000_000;
  const ctr =
    totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;
  const roas =
    spend > 0 ? totals.conversion_value_micros / 1_000_000 / spend : null;

  return { ...totals, ctr, roas };
}

/** Lower rank = shown first. Active delivery wins over paused/archived. */
function statusRank(status: string | null): number {
  const normalized = (status ?? "").toLowerCase();

  if (normalized === "active") return 0;
  if (normalized === "learning" || normalized === "in_process") return 1;
  if (normalized === "pending_review" || normalized === "pending") return 2;
  if (normalized === "paused") return 3;
  if (normalized === "campaign_paused" || normalized === "adset_paused") return 4;
  if (normalized === "archived") return 5;
  if (normalized === "deleted" || normalized === "disapproved") return 6;

  return 4;
}

/** Composite score for ad sets / ads — favors spend with ROAS and conversion efficiency. */
function performanceScore(row: EntityPerformanceRow): number {
  const spend = row.spendMicros / 1_000_000;
  const roas = row.roas ?? 0;
  const hasDelivery = row.impressions > 0 || spend > 0;

  if (!hasDelivery) return 0;

  return (
    spend * 1_000 +
    roas * spend * 250 +
    row.conversions * 100 +
    row.ctr * 15 +
    row.clicks * 2
  );
}

function sortEntityRows(
  left: EntityPerformanceRow,
  right: EntityPerformanceRow,
  entityType: CampaignEntityType,
): number {
  if (entityType === "campaign") {
    return right.spendMicros - left.spendMicros;
  }

  const statusDiff = statusRank(left.status) - statusRank(right.status);
  if (statusDiff !== 0) return statusDiff;

  const scoreDiff = performanceScore(right) - performanceScore(left);
  if (scoreDiff !== 0) return scoreDiff;

  return right.spendMicros - left.spendMicros;
}

export async function listCampaignPerformance(input: {
  userId: string;
  entityType: CampaignEntityType;
  search?: string;
  accountId?: string;
  page?: number;
  pageSize?: number;
}): Promise<CampaignsListResult> {
  const supabase = await createClient();
  const page = input.page ?? 0;
  const pageSize = input.pageSize ?? PAGE_SIZE_DEFAULT;
  const search = input.search?.trim().toLowerCase() ?? "";

  const currentStart = new Date();
  currentStart.setDate(currentStart.getDate() - 30);
  const currentStartIso = currentStart.toISOString().slice(0, 10);

  const [{ data: accountEntities }, { data: syncStates }] = await Promise.all([
    supabase
      .from("ad_entities")
      .select("id, name, user_connection_id")
      .eq("user_id", input.userId)
      .eq("provider", META_PROVIDER)
      .eq("entity_type", "account"),
    supabase
      .from("ad_sync_state")
      .select("sync_status")
      .eq("user_id", input.userId),
  ]);

  const accounts: CampaignAccountOption[] = (accountEntities ?? []).map(
    (account) => ({
      id: account.id as string,
      name: (account.name as string) ?? "Ad account",
      userConnectionId: account.user_connection_id as string,
    }),
  );

  const accountNameByConnection = new Map(
    accounts.map((account) => [account.userConnectionId, account.name]),
  );

  const selectedAccount = input.accountId
    ? accounts.find((account) => account.id === input.accountId)
    : undefined;

  let entityQuery = supabase
    .from("ad_entities")
    .select(
      "id, entity_type, name, status, objective, parent_id, user_connection_id, last_synced_at",
    )
    .eq("user_id", input.userId)
    .eq("provider", META_PROVIDER)
    .eq("entity_type", input.entityType);

  if (selectedAccount) {
    entityQuery = entityQuery.eq(
      "user_connection_id",
      selectedAccount.userConnectionId,
    );
  }

  const { data: entities, error: entitiesError } = await entityQuery;
  if (entitiesError) throw entitiesError;

  const entityList = (entities ?? []) as EntityRecord[];
  if (entityList.length === 0) {
    return {
      rows: [],
      totalCount: 0,
      accounts,
      syncing: (syncStates ?? []).some((state) => state.sync_status === "running"),
    };
  }

  const parentIds = Array.from(
    new Set(entityList.map((entity) => entity.parent_id).filter(Boolean)),
  ) as string[];

  const parentNameById = new Map<string, string>();
  if (parentIds.length > 0) {
    const { data: parents } = await supabase
      .from("ad_entities")
      .select("id, name")
      .in("id", parentIds);

    for (const parent of parents ?? []) {
      parentNameById.set(parent.id as string, (parent.name as string) ?? "—");
    }
  }

  const entityIds = entityList.map((entity) => entity.id);
  const { data: metrics } = await supabase
    .from("ad_metrics_daily")
    .select(
      "entity_id, spend_micros, impressions, clicks, conversions, conversion_value_micros",
    )
    .in("entity_id", entityIds)
    .gte("metric_date", currentStartIso);

  const metricsByEntity = new Map<string, MetricRecord[]>();
  for (const metric of (metrics ?? []) as MetricRecord[]) {
    const bucket = metricsByEntity.get(metric.entity_id) ?? [];
    bucket.push(metric);
    metricsByEntity.set(metric.entity_id, bucket);
  }

  let rows: EntityPerformanceRow[] = entityList.map((entity) => {
    const totals = aggregateMetrics(metricsByEntity.get(entity.id) ?? []);

    return {
      id: entity.id,
      entityType: entity.entity_type,
      name: entity.name ?? "Untitled",
      status: entity.status,
      objective: entity.objective,
      accountName:
        accountNameByConnection.get(entity.user_connection_id) ?? "Ad account",
      parentName: entity.parent_id
        ? (parentNameById.get(entity.parent_id) ?? null)
        : null,
      userConnectionId: entity.user_connection_id,
      spendMicros: totals.spend_micros,
      impressions: totals.impressions,
      clicks: totals.clicks,
      conversions: totals.conversions,
      ctr: totals.ctr,
      roas: totals.roas,
      lastSyncedAt: entity.last_synced_at,
    };
  });

  if (search) {
    rows = rows.filter((row) => {
      const haystack = [row.name, row.accountName, row.parentName, row.status, row.objective]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(search);
    });
  }

  rows.sort((left, right) => sortEntityRows(left, right, input.entityType));

  const totalCount = rows.length;
  const pagedRows = rows.slice(page * pageSize, page * pageSize + pageSize);

  return {
    rows: pagedRows,
    totalCount,
    accounts,
    syncing: (syncStates ?? []).some((state) => state.sync_status === "running"),
  };
}
