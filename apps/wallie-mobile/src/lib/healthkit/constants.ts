export const APPLE_HEALTH_PROVIDER = "apple_health";
export const APPLE_HEALTH_SERVICE = "healthkit";

/** First connect / stale sync: pull this many days of history. */
export const HEALTHKIT_FULL_LOOKBACK_DAYS = 30;

/**
 * Steady-state sync window. Two days covers "today" plus overnight sleep
 * attributed to the morning calendar day.
 */
export const HEALTHKIT_INCREMENTAL_LOOKBACK_DAYS = 2;

/** Cap individual quantity samples (HR, SpO2, etc.) per metric per sync. */
export const HEALTHKIT_SAMPLE_LIMIT = 500;

/** Coalesce HealthKit change bursts into one Supabase write. */
export const HEALTHKIT_SYNC_DEBOUNCE_MS = 45_000;

/**
 * Skip a foreground/background wake sync if we synced this recently.
 * Observer-driven syncs still go through the debounce path.
 */
export const HEALTHKIT_MIN_SYNC_INTERVAL_MS = 5 * 60_000;

/** After this long without a sync, do a full lookback again. */
export const HEALTHKIT_STALE_FULL_SYNC_MS = 12 * 60 * 60_000;

/** @deprecated use HEALTHKIT_FULL_LOOKBACK_DAYS */
export const HEALTHKIT_LOOKBACK_DAYS = HEALTHKIT_FULL_LOOKBACK_DAYS;
