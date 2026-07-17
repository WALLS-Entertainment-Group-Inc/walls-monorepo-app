import { getSupabase } from "@/lib/supabase";

import {
  APPLE_HEALTH_PROVIDER,
  HEALTHKIT_FULL_LOOKBACK_DAYS,
  HEALTHKIT_INCREMENTAL_LOOKBACK_DAYS,
  HEALTHKIT_STALE_FULL_SYNC_MS,
} from "./constants";
import {
  ensureAppleHealthConnection,
  getAppleHealthLastSyncAt,
  isAppleHealthEnabled,
  setAppleHealthLastSyncAt,
  upsertHealthSyncState,
} from "./connection";
import { readHealthKitSnapshot } from "./read";

export type AppleHealthSyncResult = {
  days: number;
  workouts: number;
  samples: number;
  weights: number;
  sleepSessions: number;
  lookbackDays: number;
  mode: "full" | "incremental";
};

export type SyncAppleHealthOptions = {
  /** Force a full historical pull regardless of last sync time. */
  forceFull?: boolean;
};

async function upsertDailySummaries(
  userId: string,
  days: Awaited<ReturnType<typeof readHealthKitSnapshot>>["daily"],
): Promise<void> {
  const supabase = getSupabase();

  for (const day of days) {
    const { data: existing } = await supabase
      .from("health_daily_summaries")
      .select("id")
      .eq("user_id", userId)
      .eq("summary_date", day.summary_date)
      .maybeSingle();

    const patch = {
      ...day,
      updated_at: new Date().toISOString(),
    };

    if (existing?.id) {
      const { error } = await supabase
        .from("health_daily_summaries")
        .update(patch)
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("health_daily_summaries").insert({
        user_id: userId,
        calories_consumed: 0,
        calories_burned: 0,
        calories_net: 0,
        ...patch,
      });
      if (error) throw error;
    }
  }
}

async function upsertWorkouts(
  userId: string,
  connectionId: string,
  workouts: Awaited<ReturnType<typeof readHealthKitSnapshot>>["workouts"],
): Promise<number> {
  if (workouts.length === 0) return 0;
  const supabase = getSupabase();

  const { data: existingRows } = await supabase
    .from("health_activities")
    .select("id, provider_activity_id")
    .eq("user_connection_id", connectionId);

  const existingByProviderId = new Map<string, string>();
  for (const row of existingRows ?? []) {
    if (row.provider_activity_id) {
      existingByProviderId.set(
        row.provider_activity_id as string,
        row.id as string,
      );
    }
  }

  let written = 0;
  for (const workout of workouts) {
    const row = {
      user_id: userId,
      user_connection_id: connectionId,
      provider: APPLE_HEALTH_PROVIDER,
      provider_activity_id: workout.provider_activity_id,
      activity_type: workout.activity_type,
      name: workout.name,
      started_at: workout.started_at,
      ended_at: workout.ended_at,
      duration_seconds: workout.duration_seconds,
      distance_meters: workout.distance_meters,
      calories_burned: workout.calories_burned,
      raw_payload: workout.raw_payload,
      updated_at: new Date().toISOString(),
    };

    const existingId = existingByProviderId.get(workout.provider_activity_id);
    if (existingId) {
      const { error } = await supabase
        .from("health_activities")
        .update(row)
        .eq("id", existingId);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("health_activities").insert(row);
      if (error) throw error;
    }
    written += 1;
  }

  return written;
}

async function upsertMetricSamples(
  userId: string,
  connectionId: string,
  samples: Awaited<ReturnType<typeof readHealthKitSnapshot>>["samples"],
): Promise<number> {
  if (samples.length === 0) return 0;
  const supabase = getSupabase();

  const { data: existingRows } = await supabase
    .from("health_metric_samples")
    .select("id, provider_sample_id")
    .eq("user_id", userId)
    .eq("provider", APPLE_HEALTH_PROVIDER)
    .in(
      "provider_sample_id",
      samples.map((s) => s.provider_sample_id),
    );

  const existingById = new Map<string, string>();
  for (const row of existingRows ?? []) {
    if (row.provider_sample_id) {
      existingById.set(row.provider_sample_id as string, row.id as string);
    }
  }

  let written = 0;
  const toInsert = [];

  for (const sample of samples) {
    const row = {
      user_id: userId,
      user_connection_id: connectionId,
      provider: APPLE_HEALTH_PROVIDER,
      provider_sample_id: sample.provider_sample_id,
      metric_type: sample.metric_type,
      recorded_at: sample.recorded_at,
      ended_at: sample.ended_at,
      value: sample.value,
      unit: sample.unit,
      source_name: sample.source_name,
      source_bundle_id: sample.source_bundle_id,
      raw_payload: sample.raw_payload,
      updated_at: new Date().toISOString(),
    };

    const existingId = existingById.get(sample.provider_sample_id);
    if (existingId) {
      const { error } = await supabase
        .from("health_metric_samples")
        .update(row)
        .eq("id", existingId);
      if (error) throw error;
      written += 1;
    } else {
      toInsert.push(row);
    }
  }

  // Batch insert new samples
  const CHUNK = 100;
  for (let i = 0; i < toInsert.length; i += CHUNK) {
    const chunk = toInsert.slice(i, i + CHUNK);
    const { error } = await supabase.from("health_metric_samples").insert(chunk);
    if (error) throw error;
    written += chunk.length;
  }

  return written;
}

async function upsertWeights(
  userId: string,
  weights: Awaited<ReturnType<typeof readHealthKitSnapshot>>["weights"],
): Promise<number> {
  if (weights.length === 0) return 0;
  const supabase = getSupabase();
  let written = 0;

  for (const weight of weights) {
    const { data: existing } = await supabase
      .from("health_weight_logs")
      .select("id")
      .eq("user_id", userId)
      .eq("source", "apple_health")
      .contains("source_metadata", {
        provider_sample_id: weight.provider_sample_id,
      })
      .maybeSingle();

    const row = {
      user_id: userId,
      logged_at: weight.logged_at,
      weight_kg: weight.weight_kg,
      body_fat_percent: weight.body_fat_percent,
      source: "apple_health",
      source_metadata: {
        provider_sample_id: weight.provider_sample_id,
      },
      updated_at: new Date().toISOString(),
    };

    if (existing?.id) {
      const { error } = await supabase
        .from("health_weight_logs")
        .update(row)
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("health_weight_logs").insert(row);
      if (error) throw error;
    }
    written += 1;
  }

  return written;
}

async function upsertSleepSessions(
  userId: string,
  connectionId: string,
  sessions: Awaited<ReturnType<typeof readHealthKitSnapshot>>["sleepSessions"],
): Promise<number> {
  if (sessions.length === 0) return 0;
  const supabase = getSupabase();

  const { data: existingRows } = await supabase
    .from("health_sleep_sessions")
    .select("id, provider_session_id")
    .eq("user_id", userId)
    .eq("provider", APPLE_HEALTH_PROVIDER);

  const existingById = new Map<string, string>();
  for (const row of existingRows ?? []) {
    if (row.provider_session_id) {
      existingById.set(row.provider_session_id as string, row.id as string);
    }
  }

  let written = 0;
  for (const session of sessions) {
    const row = {
      user_id: userId,
      user_connection_id: connectionId,
      provider: APPLE_HEALTH_PROVIDER,
      provider_session_id: session.provider_session_id,
      started_at: session.started_at,
      ended_at: session.ended_at,
      asleep_minutes: session.asleep_minutes,
      in_bed_minutes: session.in_bed_minutes,
      deep_minutes: session.deep_minutes,
      rem_minutes: session.rem_minutes,
      core_minutes: session.core_minutes,
      awake_minutes: session.awake_minutes,
      source_name: session.source_name,
      raw_payload: session.raw_payload,
      updated_at: new Date().toISOString(),
    };

    const existingId = existingById.get(session.provider_session_id);
    if (existingId) {
      const { error } = await supabase
        .from("health_sleep_sessions")
        .update(row)
        .eq("id", existingId);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("health_sleep_sessions").insert(row);
      if (error) throw error;
    }
    written += 1;
  }

  return written;
}

/**
 * Apple Health → Supabase sync. Uses a full lookback on first/stale sync,
 * otherwise a short incremental window to stay cheap and current.
 */
export async function syncAppleHealth(
  userId: string,
  options: SyncAppleHealthOptions = {},
): Promise<AppleHealthSyncResult> {
  const connection = await ensureAppleHealthConnection(userId);

  await upsertHealthSyncState({
    userId,
    connectionId: connection.id,
    syncStatus: "syncing",
  });

  try {
    const lastSyncAt = await getAppleHealthLastSyncAt();
    const lastSyncMs = lastSyncAt ? Date.parse(lastSyncAt) : NaN;
    const stale =
      !Number.isFinite(lastSyncMs) ||
      Date.now() - lastSyncMs >= HEALTHKIT_STALE_FULL_SYNC_MS;
    const mode: "full" | "incremental" =
      options.forceFull || stale ? "full" : "incremental";
    const lookbackDays =
      mode === "full"
        ? HEALTHKIT_FULL_LOOKBACK_DAYS
        : HEALTHKIT_INCREMENTAL_LOOKBACK_DAYS;

    const snapshot = await readHealthKitSnapshot(lookbackDays);

    await upsertDailySummaries(userId, snapshot.daily);
    const workouts = await upsertWorkouts(
      userId,
      connection.id,
      snapshot.workouts,
    );
    const samples = await upsertMetricSamples(
      userId,
      connection.id,
      snapshot.samples,
    );
    const weights = await upsertWeights(userId, snapshot.weights);
    const sleepSessions = await upsertSleepSessions(
      userId,
      connection.id,
      snapshot.sleepSessions,
    );

    const syncedAt = new Date().toISOString();
    await setAppleHealthLastSyncAt(syncedAt);

    await upsertHealthSyncState({
      userId,
      connectionId: connection.id,
      syncStatus: "idle",
      lastError: null,
      activityCursor: {
        last_sync_at: syncedAt,
        mode,
        lookback_days: lookbackDays,
        days: snapshot.daily.length,
        workouts,
        samples,
        weights,
        sleepSessions,
      },
    });

    return {
      days: snapshot.daily.length,
      workouts,
      samples,
      weights,
      sleepSessions,
      lookbackDays,
      mode,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Apple Health sync failed";
    await upsertHealthSyncState({
      userId,
      connectionId: connection.id,
      syncStatus: "error",
      lastError: message,
    });
    throw error;
  }
}

/** Sync only if the user previously enabled Apple Health in Wallie. */
export async function syncAppleHealthIfEnabled(
  userId: string,
  options: SyncAppleHealthOptions = {},
): Promise<AppleHealthSyncResult | null> {
  const enabled = await isAppleHealthEnabled();
  if (!enabled) return null;
  return syncAppleHealth(userId, options);
}
