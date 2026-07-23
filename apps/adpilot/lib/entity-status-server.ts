import { createAdminClient } from "@walls/supabase/admin";
import { createClient } from "@walls/supabase/server";

import { type AdDataScope, withAdScope } from "@/lib/ad-scope";
import { updateMetaEntityStatus } from "@/lib/meta-graph";

export type DeliveryStatus = "ACTIVE" | "PAUSED";

const STATUSABLE_ENTITY_TYPES = new Set(["campaign", "ad_group"]);

export async function updateEntityDeliveryStatus(input: {
  scope: AdDataScope;
  entityId: string;
  status: DeliveryStatus;
}): Promise<{ status: string }> {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: entity, error: entityError } = await withAdScope(
    supabase
      .from("ad_entities")
      .select("id, entity_type, provider_entity_id, account_connection_id")
      .eq("id", input.entityId),
    input.scope,
  ).maybeSingle();

  if (entityError) throw entityError;
  if (!entity) throw new Error("Entity not found");

  if (!STATUSABLE_ENTITY_TYPES.has(entity.entity_type as string)) {
    throw new Error("Only campaigns and ad sets support status changes.");
  }

  const { data: connection, error: connectionError } = await admin
    .from("account_connections")
    .select("access_token")
    .eq("id", entity.account_connection_id)
    .eq("account_id", input.scope.accountId)
    .is("revoked_at", null)
    .maybeSingle();

  if (connectionError) throw connectionError;

  const accessToken = connection?.access_token as string | undefined;
  if (!accessToken) {
    throw new Error("Meta connection is not available for this ad account.");
  }

  await updateMetaEntityStatus(
    entity.provider_entity_id as string,
    accessToken,
    input.status,
  );

  const localStatus = input.status === "ACTIVE" ? "active" : "paused";
  const now = new Date().toISOString();

  const { error: entityUpdateError } = await withAdScope(
    admin
      .from("ad_entities")
      .update({ status: localStatus, updated_at: now })
      .eq("id", input.entityId),
    input.scope,
  );

  if (entityUpdateError) throw entityUpdateError;

  return { status: localStatus };
}
