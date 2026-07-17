import AsyncStorage from "@react-native-async-storage/async-storage";

import { getSupabase } from "@/lib/supabase";

import {
  APPLE_HEALTH_PROVIDER,
  APPLE_HEALTH_SERVICE,
} from "./constants";

const ENABLED_KEY = "wallie.apple_health.enabled";
const LAST_SYNC_KEY = "wallie.apple_health.last_sync_at";

export async function isAppleHealthEnabled(): Promise<boolean> {
  const value = await AsyncStorage.getItem(ENABLED_KEY);
  return value === "1";
}

export async function setAppleHealthEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(ENABLED_KEY, enabled ? "1" : "0");
  if (!enabled) {
    await AsyncStorage.removeItem(LAST_SYNC_KEY);
  }
}

export async function getAppleHealthLastSyncAt(): Promise<string | null> {
  return AsyncStorage.getItem(LAST_SYNC_KEY);
}

export async function setAppleHealthLastSyncAt(iso: string): Promise<void> {
  await AsyncStorage.setItem(LAST_SYNC_KEY, iso);
}

export type AppleHealthConnection = {
  id: string;
  user_id: string;
};

/**
 * Ensures a user_connections row exists for Apple Health so activities and
 * sync state can key off a stable connection id (same pattern as Strava).
 */
export async function ensureAppleHealthConnection(
  userId: string,
): Promise<AppleHealthConnection> {
  const supabase = getSupabase();

  const { data: existing, error: selectError } = await supabase
    .from("user_connections")
    .select("id, user_id")
    .eq("user_id", userId)
    .eq("provider", APPLE_HEALTH_PROVIDER)
    .eq("service", APPLE_HEALTH_SERVICE)
    .is("revoked_at", null)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing?.id) {
    return { id: existing.id as string, user_id: existing.user_id as string };
  }

  const now = new Date().toISOString();
  const { data: inserted, error: insertError } = await supabase
    .from("user_connections")
    .insert({
      user_id: userId,
      provider: APPLE_HEALTH_PROVIDER,
      service: APPLE_HEALTH_SERVICE,
      account_id: "local",
      access_token: null,
      refresh_token: null,
      token_payload: {
        source: "wallie_mobile",
        connected_at: now,
      },
      updated_at: now,
      revoked_at: null,
    })
    .select("id, user_id")
    .single();

  if (insertError) throw insertError;
  return {
    id: inserted.id as string,
    user_id: inserted.user_id as string,
  };
}

export async function revokeAppleHealthConnection(
  userId: string,
): Promise<void> {
  const supabase = getSupabase();
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("user_connections")
    .update({ revoked_at: now, updated_at: now })
    .eq("user_id", userId)
    .eq("provider", APPLE_HEALTH_PROVIDER)
    .eq("service", APPLE_HEALTH_SERVICE)
    .is("revoked_at", null);

  if (error) throw error;
  await setAppleHealthEnabled(false);
}

export async function upsertHealthSyncState(input: {
  userId: string;
  connectionId: string;
  syncStatus: "idle" | "syncing" | "error";
  lastError?: string | null;
  activityCursor?: Record<string, unknown>;
}): Promise<void> {
  const supabase = getSupabase();
  const now = new Date().toISOString();

  const { data: existing } = await supabase
    .from("health_sync_state")
    .select("id")
    .eq("user_connection_id", input.connectionId)
    .maybeSingle();

  const row = {
    user_id: input.userId,
    user_connection_id: input.connectionId,
    provider: APPLE_HEALTH_PROVIDER,
    sync_status: input.syncStatus,
    last_error: input.lastError ?? null,
    activity_cursor: input.activityCursor ?? {},
    updated_at: now,
    ...(input.syncStatus === "idle"
      ? { last_incremental_sync_at: now }
      : {}),
  };

  if (existing?.id) {
    const { error } = await supabase
      .from("health_sync_state")
      .update(row)
      .eq("id", existing.id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("health_sync_state").insert(row);
  if (error) throw error;
}
