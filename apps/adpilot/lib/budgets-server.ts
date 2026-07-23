import { createClient } from "@walls/supabase/server";

import {
  type AdDataScope,
  adScopeFields,
  withAdScope,
} from "@/lib/ad-scope";
import {
  BUDGET_ALLOCATION_CATEGORIES,
  BUDGET_CHANNELS,
  BUDGET_OBJECTIVE_METRICS,
  BUDGET_OBJECTIVE_STATUSES,
  BUDGET_PERIOD_STATUSES,
  BUDGET_PERIOD_TYPES,
  BUDGET_TARGET_OPERATORS,
  isPeriodCurrentlyEffective,
  type BudgetAllocation,
  type BudgetAllocationCategory,
  type BudgetChannel,
  type BudgetObjective,
  type BudgetObjectiveMetric,
  type BudgetObjectiveStatus,
  type BudgetPeriod,
  type BudgetPeriodStatus,
  type BudgetPeriodType,
  type BudgetTargetOperator,
} from "@/lib/budgets-shared";

const PERIOD_SELECT =
  "id, name, description, period_type, fiscal_year, fiscal_quarter, start_date, end_date, status, currency, primary_focus, created_at, updated_at";

const ALLOCATION_SELECT =
  "id, period_id, name, category, channel, amount_micros, currency, notes, sort_order, created_at, updated_at";

const OBJECTIVE_SELECT =
  "id, period_id, name, metric_key, custom_metric_label, target_value, target_operator, target_unit, is_primary, priority, status, notes, created_at, updated_at";

function asPeriodType(value: unknown): BudgetPeriodType {
  return BUDGET_PERIOD_TYPES.includes(value as BudgetPeriodType)
    ? (value as BudgetPeriodType)
    : "custom";
}

function asPeriodStatus(value: unknown): BudgetPeriodStatus {
  return BUDGET_PERIOD_STATUSES.includes(value as BudgetPeriodStatus)
    ? (value as BudgetPeriodStatus)
    : "planned";
}

function asCategory(value: unknown): BudgetAllocationCategory {
  return BUDGET_ALLOCATION_CATEGORIES.includes(value as BudgetAllocationCategory)
    ? (value as BudgetAllocationCategory)
    : "other";
}

function asChannel(value: unknown): BudgetChannel | null {
  if (value == null) return null;
  return BUDGET_CHANNELS.includes(value as BudgetChannel)
    ? (value as BudgetChannel)
    : "other";
}

function asMetric(value: unknown): BudgetObjectiveMetric {
  return BUDGET_OBJECTIVE_METRICS.includes(value as BudgetObjectiveMetric)
    ? (value as BudgetObjectiveMetric)
    : "custom";
}

function asOperator(value: unknown): BudgetTargetOperator {
  return BUDGET_TARGET_OPERATORS.includes(value as BudgetTargetOperator)
    ? (value as BudgetTargetOperator)
    : "gte";
}

function asObjectiveStatus(value: unknown): BudgetObjectiveStatus {
  return BUDGET_OBJECTIVE_STATUSES.includes(value as BudgetObjectiveStatus)
    ? (value as BudgetObjectiveStatus)
    : "active";
}

function mapAllocation(row: Record<string, unknown>): BudgetAllocation {
  return {
    id: row.id as string,
    periodId: row.period_id as string,
    name: row.name as string,
    category: asCategory(row.category),
    channel: asChannel(row.channel),
    amountMicros: Number(row.amount_micros ?? 0),
    currency: (row.currency as string) ?? "USD",
    notes: (row.notes as string | null) ?? null,
    sortOrder: Number(row.sort_order ?? 0),
    createdAt: row.created_at as string,
    updatedAt: (row.updated_at as string | null) ?? null,
  };
}

function mapObjective(row: Record<string, unknown>): BudgetObjective {
  return {
    id: row.id as string,
    periodId: row.period_id as string,
    name: row.name as string,
    metricKey: asMetric(row.metric_key),
    customMetricLabel: (row.custom_metric_label as string | null) ?? null,
    targetValue: Number(row.target_value ?? 0),
    targetOperator: asOperator(row.target_operator),
    targetUnit: (row.target_unit as string | null) ?? null,
    isPrimary: Boolean(row.is_primary),
    priority: Number(row.priority ?? 0),
    status: asObjectiveStatus(row.status),
    notes: (row.notes as string | null) ?? null,
    createdAt: row.created_at as string,
    updatedAt: (row.updated_at as string | null) ?? null,
  };
}

function mapPeriod(
  row: Record<string, unknown>,
  allocations: BudgetAllocation[],
  objectives: BudgetObjective[],
): BudgetPeriod {
  const status = asPeriodStatus(row.status);
  const startDate = row.start_date as string;
  const endDate = (row.end_date as string | null) ?? null;
  return {
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string | null) ?? null,
    periodType: asPeriodType(row.period_type),
    fiscalYear:
      row.fiscal_year == null ? null : Number(row.fiscal_year),
    fiscalQuarter:
      row.fiscal_quarter == null ? null : Number(row.fiscal_quarter),
    startDate,
    endDate,
    status,
    currency: (row.currency as string) ?? "USD",
    primaryFocus: (row.primary_focus as string | null) ?? null,
    createdAt: row.created_at as string,
    updatedAt: (row.updated_at as string | null) ?? null,
    isCurrentlyEffective: isPeriodCurrentlyEffective({
      status,
      startDate,
      endDate,
    }),
    totalBudgetMicros: allocations.reduce(
      (sum, item) => sum + item.amountMicros,
      0,
    ),
    allocations,
    objectives,
  };
}

export async function listBudgetPeriods(
  scope: AdDataScope,
): Promise<BudgetPeriod[]> {
  const supabase = await createClient();

  const { data: periodRows, error: periodError } = await withAdScope(
    supabase.from("ad_budget_periods").select(PERIOD_SELECT),
    scope,
  )
    .order("status", { ascending: true })
    .order("start_date", { ascending: false });

  if (periodError) throw periodError;

  const periods = periodRows ?? [];
  if (periods.length === 0) return [];

  const periodIds = periods.map((p) => p.id as string);

  const [{ data: allocationRows, error: allocationError }, { data: objectiveRows, error: objectiveError }] =
    await Promise.all([
      withAdScope(
        supabase.from("ad_budget_allocations").select(ALLOCATION_SELECT),
        scope,
      )
        .in("period_id", periodIds)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      withAdScope(
        supabase.from("ad_budget_objectives").select(OBJECTIVE_SELECT),
        scope,
      )
        .in("period_id", periodIds)
        .order("is_primary", { ascending: false })
        .order("priority", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);

  if (allocationError) throw allocationError;
  if (objectiveError) throw objectiveError;

  const allocationsByPeriod = new Map<string, BudgetAllocation[]>();
  for (const row of allocationRows ?? []) {
    const mapped = mapAllocation(row);
    const list = allocationsByPeriod.get(mapped.periodId) ?? [];
    list.push(mapped);
    allocationsByPeriod.set(mapped.periodId, list);
  }

  const objectivesByPeriod = new Map<string, BudgetObjective[]>();
  for (const row of objectiveRows ?? []) {
    const mapped = mapObjective(row);
    const list = objectivesByPeriod.get(mapped.periodId) ?? [];
    list.push(mapped);
    objectivesByPeriod.set(mapped.periodId, list);
  }

  const mapped = periods.map((row) =>
    mapPeriod(
      row,
      allocationsByPeriod.get(row.id as string) ?? [],
      objectivesByPeriod.get(row.id as string) ?? [],
    ),
  );

  // Surface currently-effective periods first, then active, then by start date.
  return mapped.sort((a, b) => {
    if (a.isCurrentlyEffective !== b.isCurrentlyEffective) {
      return a.isCurrentlyEffective ? -1 : 1;
    }
    if (a.status !== b.status) {
      const rank: Record<BudgetPeriodStatus, number> = {
        active: 0,
        planned: 1,
        completed: 2,
        archived: 3,
      };
      return rank[a.status] - rank[b.status];
    }
    return b.startDate.localeCompare(a.startDate);
  });
}

export type CreateBudgetPeriodInput = {
  name: string;
  description?: string | null;
  periodType: BudgetPeriodType;
  fiscalYear?: number | null;
  fiscalQuarter?: number | null;
  startDate: string;
  endDate?: string | null;
  status?: BudgetPeriodStatus;
  currency?: string;
  primaryFocus?: string | null;
};

export async function createBudgetPeriod(input: {
  scope: AdDataScope;
  data: CreateBudgetPeriodInput;
}): Promise<BudgetPeriod> {
  const supabase = await createClient();
  const periodType = input.data.periodType;
  const endDate =
    periodType === "ongoing" ? null : (input.data.endDate ?? null);

  const { data, error } = await supabase
    .from("ad_budget_periods")
    .insert({
      ...adScopeFields(input.scope),
      created_by: input.scope.userId,
      updated_by: input.scope.userId,
      name: input.data.name.trim(),
      description: input.data.description?.trim() || null,
      period_type: periodType,
      fiscal_year: input.data.fiscalYear ?? null,
      fiscal_quarter: input.data.fiscalQuarter ?? null,
      start_date: input.data.startDate,
      end_date: endDate,
      status: input.data.status ?? "planned",
      currency: (input.data.currency ?? "USD").toUpperCase(),
      primary_focus: input.data.primaryFocus?.trim() || null,
    })
    .select(PERIOD_SELECT)
    .single();

  if (error) throw error;
  return mapPeriod(data, [], []);
}

export type UpdateBudgetPeriodInput = Partial<CreateBudgetPeriodInput>;

export async function updateBudgetPeriod(input: {
  scope: AdDataScope;
  periodId: string;
  patch: UpdateBudgetPeriodInput;
}): Promise<BudgetPeriod> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const updates: Record<string, unknown> = {
    updated_at: now,
    updated_by: input.scope.userId,
  };

  if (input.patch.name !== undefined) updates.name = input.patch.name.trim();
  if (input.patch.description !== undefined) {
    updates.description = input.patch.description?.trim() || null;
  }
  if (input.patch.periodType !== undefined) {
    updates.period_type = input.patch.periodType;
    if (input.patch.periodType === "ongoing") {
      updates.end_date = null;
    }
  }
  if (input.patch.fiscalYear !== undefined) {
    updates.fiscal_year = input.patch.fiscalYear;
  }
  if (input.patch.fiscalQuarter !== undefined) {
    updates.fiscal_quarter = input.patch.fiscalQuarter;
  }
  if (input.patch.startDate !== undefined) {
    updates.start_date = input.patch.startDate;
  }
  if (input.patch.endDate !== undefined) {
    updates.end_date = input.patch.endDate;
  }
  if (input.patch.status !== undefined) updates.status = input.patch.status;
  if (input.patch.currency !== undefined) {
    updates.currency = input.patch.currency.toUpperCase();
  }
  if (input.patch.primaryFocus !== undefined) {
    updates.primary_focus = input.patch.primaryFocus?.trim() || null;
  }

  const { data, error } = await withAdScope(
    supabase.from("ad_budget_periods").update(updates).select(PERIOD_SELECT),
    input.scope,
  )
    .eq("id", input.periodId)
    .single();

  if (error) throw error;

  const all = await listBudgetPeriods(input.scope);
  const refreshed = all.find((p) => p.id === input.periodId);
  if (refreshed) return refreshed;
  return mapPeriod(data, [], []);
}

export async function deleteBudgetPeriod(input: {
  scope: AdDataScope;
  periodId: string;
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await withAdScope(
    supabase.from("ad_budget_periods").delete(),
    input.scope,
  ).eq("id", input.periodId);

  if (error) throw error;
}

export type CreateAllocationInput = {
  name: string;
  category: BudgetAllocationCategory;
  channel?: BudgetChannel | null;
  amountMicros: number;
  currency?: string;
  notes?: string | null;
  sortOrder?: number;
};

export async function createBudgetAllocation(input: {
  scope: AdDataScope;
  periodId: string;
  data: CreateAllocationInput;
}): Promise<BudgetAllocation> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ad_budget_allocations")
    .insert({
      ...adScopeFields(input.scope),
      period_id: input.periodId,
      created_by: input.scope.userId,
      updated_by: input.scope.userId,
      name: input.data.name.trim(),
      category: input.data.category,
      channel: input.data.channel ?? null,
      amount_micros: Math.max(0, Math.round(input.data.amountMicros)),
      currency: (input.data.currency ?? "USD").toUpperCase(),
      notes: input.data.notes?.trim() || null,
      sort_order: input.data.sortOrder ?? 0,
    })
    .select(ALLOCATION_SELECT)
    .single();

  if (error) throw error;
  return mapAllocation(data);
}

export type UpdateAllocationInput = Partial<CreateAllocationInput>;

export async function updateBudgetAllocation(input: {
  scope: AdDataScope;
  allocationId: string;
  patch: UpdateAllocationInput;
}): Promise<BudgetAllocation> {
  const supabase = await createClient();
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
    updated_by: input.scope.userId,
  };

  if (input.patch.name !== undefined) updates.name = input.patch.name.trim();
  if (input.patch.category !== undefined) updates.category = input.patch.category;
  if (input.patch.channel !== undefined) updates.channel = input.patch.channel;
  if (input.patch.amountMicros !== undefined) {
    updates.amount_micros = Math.max(0, Math.round(input.patch.amountMicros));
  }
  if (input.patch.currency !== undefined) {
    updates.currency = input.patch.currency.toUpperCase();
  }
  if (input.patch.notes !== undefined) {
    updates.notes = input.patch.notes?.trim() || null;
  }
  if (input.patch.sortOrder !== undefined) {
    updates.sort_order = input.patch.sortOrder;
  }

  const { data, error } = await withAdScope(
    supabase
      .from("ad_budget_allocations")
      .update(updates)
      .select(ALLOCATION_SELECT),
    input.scope,
  )
    .eq("id", input.allocationId)
    .single();

  if (error) throw error;
  return mapAllocation(data);
}

export async function deleteBudgetAllocation(input: {
  scope: AdDataScope;
  allocationId: string;
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await withAdScope(
    supabase.from("ad_budget_allocations").delete(),
    input.scope,
  ).eq("id", input.allocationId);

  if (error) throw error;
}

export type CreateObjectiveInput = {
  name: string;
  metricKey: BudgetObjectiveMetric;
  customMetricLabel?: string | null;
  targetValue: number;
  targetOperator?: BudgetTargetOperator;
  targetUnit?: string | null;
  isPrimary?: boolean;
  priority?: number;
  status?: BudgetObjectiveStatus;
  notes?: string | null;
};

async function clearPrimaryObjective(
  scope: AdDataScope,
  periodId: string,
  exceptId?: string,
) {
  const supabase = await createClient();
  let query = withAdScope(
    supabase
      .from("ad_budget_objectives")
      .update({
        is_primary: false,
        updated_at: new Date().toISOString(),
        updated_by: scope.userId,
      }),
    scope,
  )
    .eq("period_id", periodId)
    .eq("is_primary", true);

  if (exceptId) {
    query = query.neq("id", exceptId);
  }

  const { error } = await query;
  if (error) throw error;
}

export async function createBudgetObjective(input: {
  scope: AdDataScope;
  periodId: string;
  data: CreateObjectiveInput;
}): Promise<BudgetObjective> {
  const supabase = await createClient();

  if (input.data.isPrimary) {
    await clearPrimaryObjective(input.scope, input.periodId);
  }

  const { data, error } = await supabase
    .from("ad_budget_objectives")
    .insert({
      ...adScopeFields(input.scope),
      period_id: input.periodId,
      created_by: input.scope.userId,
      updated_by: input.scope.userId,
      name: input.data.name.trim(),
      metric_key: input.data.metricKey,
      custom_metric_label:
        input.data.metricKey === "custom"
          ? input.data.customMetricLabel?.trim() || null
          : null,
      target_value: input.data.targetValue,
      target_operator: input.data.targetOperator ?? "gte",
      target_unit: input.data.targetUnit?.trim() || null,
      is_primary: input.data.isPrimary ?? false,
      priority: input.data.priority ?? 0,
      status: input.data.status ?? "active",
      notes: input.data.notes?.trim() || null,
    })
    .select(OBJECTIVE_SELECT)
    .single();

  if (error) throw error;
  return mapObjective(data);
}

export type UpdateObjectiveInput = Partial<CreateObjectiveInput>;

export async function updateBudgetObjective(input: {
  scope: AdDataScope;
  objectiveId: string;
  periodId: string;
  patch: UpdateObjectiveInput;
}): Promise<BudgetObjective> {
  const supabase = await createClient();

  if (input.patch.isPrimary === true) {
    await clearPrimaryObjective(
      input.scope,
      input.periodId,
      input.objectiveId,
    );
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
    updated_by: input.scope.userId,
  };

  if (input.patch.name !== undefined) updates.name = input.patch.name.trim();
  if (input.patch.metricKey !== undefined) {
    updates.metric_key = input.patch.metricKey;
    if (input.patch.metricKey !== "custom") {
      updates.custom_metric_label = null;
    }
  }
  if (input.patch.customMetricLabel !== undefined) {
    updates.custom_metric_label = input.patch.customMetricLabel?.trim() || null;
  }
  if (input.patch.targetValue !== undefined) {
    updates.target_value = input.patch.targetValue;
  }
  if (input.patch.targetOperator !== undefined) {
    updates.target_operator = input.patch.targetOperator;
  }
  if (input.patch.targetUnit !== undefined) {
    updates.target_unit = input.patch.targetUnit?.trim() || null;
  }
  if (input.patch.isPrimary !== undefined) {
    updates.is_primary = input.patch.isPrimary;
  }
  if (input.patch.priority !== undefined) {
    updates.priority = input.patch.priority;
  }
  if (input.patch.status !== undefined) updates.status = input.patch.status;
  if (input.patch.notes !== undefined) {
    updates.notes = input.patch.notes?.trim() || null;
  }

  const { data, error } = await withAdScope(
    supabase
      .from("ad_budget_objectives")
      .update(updates)
      .select(OBJECTIVE_SELECT),
    input.scope,
  )
    .eq("id", input.objectiveId)
    .single();

  if (error) throw error;
  return mapObjective(data);
}

export async function deleteBudgetObjective(input: {
  scope: AdDataScope;
  objectiveId: string;
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await withAdScope(
    supabase.from("ad_budget_objectives").delete(),
    input.scope,
  ).eq("id", input.objectiveId);

  if (error) throw error;
}
