import { createAdminClient } from "@walls/supabase/admin";
import { createClient } from "@walls/supabase/server";

import {
  META_PROVIDER,
  META_SERVICE,
  type SafeUserConnection,
} from "@/lib/connections";

export async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function listSafeConnectionsForUser(
  userId: string,
): Promise<SafeUserConnection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_connections")
    .select(
      "id, provider, service, account_id, token_expiry, revoked_at, created_at, updated_at",
    )
    .eq("user_id", userId)
    .is("revoked_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[adpilot] list connections:", error);
    return [];
  }

  return (data ?? []) as SafeUserConnection[];
}

export async function upsertMetaConnection(input: {
  userId: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiry: string | null;
  accountId: string | null;
  tokenPayload: Record<string, unknown>;
}) {
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("user_connections")
    .select("id")
    .eq("user_id", input.userId)
    .eq("provider", META_PROVIDER)
    .eq("service", META_SERVICE)
    .is("revoked_at", null)
    .maybeSingle();

  const row = {
    user_id: input.userId,
    provider: META_PROVIDER,
    service: META_SERVICE,
    account_id: input.accountId,
    access_token: input.accessToken,
    refresh_token: input.refreshToken,
    token_expiry: input.tokenExpiry,
    token_payload: input.tokenPayload,
    updated_at: new Date().toISOString(),
    revoked_at: null,
  };

  if (existing?.id) {
    const { error } = await admin
      .from("user_connections")
      .update(row)
      .eq("id", existing.id);
    if (error) throw error;
    return existing.id;
  }

  const { data, error } = await admin
    .from("user_connections")
    .insert(row)
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function revokeMetaConnection(userId: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("user_connections")
    .update({
      revoked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("provider", META_PROVIDER)
    .eq("service", META_SERVICE)
    .is("revoked_at", null);

  if (error) throw error;
}
