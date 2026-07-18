import {
  CategoryValueSleepAnalysis,
  queryCategorySamples,
  queryQuantitySamples,
  queryStatisticsCollectionForQuantity,
  queryStatisticsForQuantity,
  queryWorkoutSamples,
  type QuantityTypeIdentifier,
} from "@kingstinct/react-native-healthkit";

import {
  HEALTHKIT_FULL_LOOKBACK_DAYS,
  HEALTHKIT_SAMPLE_LIMIT,
} from "./constants";
import {
  DAILY_DISCRETE_METRICS,
  DAILY_QUANTITY_METRICS,
  SAMPLE_METRICS,
} from "./permissions";
import {
  addDays,
  mapWorkoutActivityType,
  minutesBetween,
  startOfLocalDay,
  toDateKey,
  workoutDisplayName,
} from "./mappers";

export type DailySummaryPatch = {
  summary_date: string;
  steps?: number | null;
  distance_walking_meters?: number | null;
  flights_climbed?: number | null;
  active_energy_kcal?: number | null;
  basal_energy_kcal?: number | null;
  exercise_minutes?: number | null;
  stand_minutes?: number | null;
  stand_hours?: number | null;
  resting_heart_rate?: number | null;
  avg_heart_rate?: number | null;
  walking_heart_rate_avg?: number | null;
  hrv_sdnn_ms?: number | null;
  respiratory_rate?: number | null;
  oxygen_saturation?: number | null;
  body_temperature_c?: number | null;
  blood_glucose_mg_dl?: number | null;
  vo2_max?: number | null;
  mindfulness_minutes?: number | null;
  sleep_asleep_minutes?: number | null;
  sleep_in_bed_minutes?: number | null;
  sleep_deep_minutes?: number | null;
  sleep_rem_minutes?: number | null;
  sleep_core_minutes?: number | null;
  sleep_awake_minutes?: number | null;
  apple_health_synced_at: string;
};

export type WorkoutRow = {
  provider_activity_id: string;
  activity_type: string;
  name: string;
  started_at: string;
  ended_at: string;
  duration_seconds: number | null;
  distance_meters: number | null;
  calories_burned: number | null;
  raw_payload: Record<string, unknown>;
};

export type MetricSampleRow = {
  provider_sample_id: string;
  metric_type: string;
  recorded_at: string;
  ended_at: string;
  value: number;
  unit: string;
  source_name: string | null;
  source_bundle_id: string | null;
  raw_payload: Record<string, unknown>;
};

export type WeightSampleRow = {
  provider_sample_id: string;
  logged_at: string;
  weight_kg: number;
  body_fat_percent: number | null;
};

export type SleepSessionRow = {
  provider_session_id: string;
  started_at: string;
  ended_at: string;
  asleep_minutes: number;
  in_bed_minutes: number;
  deep_minutes: number;
  rem_minutes: number;
  core_minutes: number;
  awake_minutes: number;
  source_name: string | null;
  raw_payload: Record<string, unknown>;
};

export type HealthKitSnapshot = {
  daily: DailySummaryPatch[];
  workouts: WorkoutRow[];
  samples: MetricSampleRow[];
  weights: WeightSampleRow[];
  sleepSessions: SleepSessionRow[];
};

function lookbackWindow(lookbackDays: number): { start: Date; end: Date } {
  const days = Math.max(1, lookbackDays);
  const end = new Date();
  const start = startOfLocalDay(addDays(end, -(days - 1)));
  return { start, end };
}

/**
 * Native HealthKit ISO8601DateFormatter rejects fractional seconds from
 * Date.toISOString() (e.g. 2026-07-18T04:00:00.000Z), which made every
 * queryStatisticsCollectionForQuantity call fail silently.
 */
function toHealthKitAnchorIso(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

function emptyDayMap(start: Date, end: Date): Map<string, DailySummaryPatch> {
  const map = new Map<string, DailySummaryPatch>();
  const syncedAt = new Date().toISOString();
  let cursor = startOfLocalDay(start);
  const last = startOfLocalDay(end);
  while (cursor <= last) {
    const key = toDateKey(cursor);
    map.set(key, { summary_date: key, apple_health_synced_at: syncedAt });
    cursor = addDays(cursor, 1);
  }
  return map;
}

async function collectDailyQuantities(
  dayMap: Map<string, DailySummaryPatch>,
  start: Date,
  end: Date,
): Promise<void> {
  for (const metric of DAILY_QUANTITY_METRICS) {
    try {
      const stats = await queryStatisticsCollectionForQuantity(
        metric.identifier as QuantityTypeIdentifier,
        [metric.kind === "cumulative" ? "cumulativeSum" : "discreteAverage"],
        toHealthKitAnchorIso(start),
        { day: 1 },
        {
          unit: metric.unit,
          filter: { startDate: start, endDate: end },
        },
      );

      for (const bucket of stats) {
        if (!bucket.startDate) continue;
        const key = toDateKey(new Date(bucket.startDate));
        const day = dayMap.get(key);
        if (!day) continue;
        const raw =
          metric.kind === "cumulative"
            ? bucket.sumQuantity?.quantity
            : bucket.averageQuantity?.quantity;
        if (raw == null || Number.isNaN(raw)) continue;
        const value = metric.transform ? metric.transform(raw) : raw;
        (day as Record<string, unknown>)[metric.column] = value;
      }
    } catch (error) {
      console.warn(`[healthkit] daily ${metric.column} failed`, error);
    }
  }

  for (const metric of DAILY_DISCRETE_METRICS) {
    try {
      // Per-day average via statistics collection
      const stats = await queryStatisticsCollectionForQuantity(
        metric.identifier,
        ["discreteAverage"],
        toHealthKitAnchorIso(start),
        { day: 1 },
        {
          unit: metric.unit,
          filter: { startDate: start, endDate: end },
        },
      );

      for (const bucket of stats) {
        if (!bucket.startDate) continue;
        const key = toDateKey(new Date(bucket.startDate));
        const day = dayMap.get(key);
        if (!day) continue;
        const raw = bucket.averageQuantity?.quantity;
        if (raw == null || Number.isNaN(raw)) continue;
        const value = metric.transform ? metric.transform(raw) : raw;
        (day as Record<string, unknown>)[metric.column] = value;
      }
    } catch (error) {
      console.warn(`[healthkit] daily discrete ${metric.column} failed`, error);
    }
  }
}

async function collectStandHours(
  dayMap: Map<string, DailySummaryPatch>,
  start: Date,
  end: Date,
): Promise<void> {
  try {
    const daySpan = Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1,
    );
    const samples = await queryCategorySamples(
      "HKCategoryTypeIdentifierAppleStandHour",
      {
        ascending: true,
        limit: Math.max(24, daySpan * 24),
        filter: { startDate: start, endDate: end },
      },
    );

    const counts = new Map<string, number>();
    for (const sample of samples) {
      // 0 = stood
      if (sample.value !== 0) continue;
      const key = toDateKey(new Date(sample.startDate));
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    for (const [key, hours] of counts) {
      const day = dayMap.get(key);
      if (day) day.stand_hours = hours;
    }
  } catch (error) {
    console.warn("[healthkit] stand hours failed", error);
  }
}

async function collectMindfulness(
  dayMap: Map<string, DailySummaryPatch>,
  start: Date,
  end: Date,
): Promise<void> {
  try {
    const samples = await queryCategorySamples(
      "HKCategoryTypeIdentifierMindfulSession",
      {
        ascending: true,
        limit: 500,
        filter: { startDate: start, endDate: end },
      },
    );

    const totals = new Map<string, number>();
    for (const sample of samples) {
      const key = toDateKey(new Date(sample.startDate));
      const mins = minutesBetween(
        new Date(sample.startDate),
        new Date(sample.endDate),
      );
      totals.set(key, (totals.get(key) ?? 0) + mins);
    }
    for (const [key, mins] of totals) {
      const day = dayMap.get(key);
      if (day) day.mindfulness_minutes = mins;
    }
  } catch (error) {
    console.warn("[healthkit] mindfulness failed", error);
  }
}

async function collectSleep(
  dayMap: Map<string, DailySummaryPatch>,
  start: Date,
  end: Date,
): Promise<SleepSessionRow[]> {
  const sessions: SleepSessionRow[] = [];

  try {
    const samples = await queryCategorySamples(
      "HKCategoryTypeIdentifierSleepAnalysis",
      {
        ascending: true,
        limit: 2000,
        filter: { startDate: start, endDate: end },
      },
    );

    type Acc = {
      asleep: number;
      inBed: number;
      deep: number;
      rem: number;
      core: number;
      awake: number;
      startedAt: Date;
      endedAt: Date;
    };

    const byDay = new Map<string, Acc>();

    for (const sample of samples) {
      const sampleStart = new Date(sample.startDate);
      const sampleEnd = new Date(sample.endDate);
      const mins = minutesBetween(sampleStart, sampleEnd);
      // Attribute sleep to the calendar day the segment ended (typical for overnight).
      const key = toDateKey(sampleEnd);
      let acc = byDay.get(key);
      if (!acc) {
        acc = {
          asleep: 0,
          inBed: 0,
          deep: 0,
          rem: 0,
          core: 0,
          awake: 0,
          startedAt: sampleStart,
          endedAt: sampleEnd,
        };
        byDay.set(key, acc);
      }
      if (sampleStart < acc.startedAt) acc.startedAt = sampleStart;
      if (sampleEnd > acc.endedAt) acc.endedAt = sampleEnd;

      switch (sample.value) {
        case CategoryValueSleepAnalysis.inBed:
          acc.inBed += mins;
          break;
        case CategoryValueSleepAnalysis.awake:
          acc.awake += mins;
          break;
        case CategoryValueSleepAnalysis.asleepDeep:
          acc.deep += mins;
          acc.asleep += mins;
          break;
        case CategoryValueSleepAnalysis.asleepREM:
          acc.rem += mins;
          acc.asleep += mins;
          break;
        case CategoryValueSleepAnalysis.asleepCore:
          acc.core += mins;
          acc.asleep += mins;
          break;
        case CategoryValueSleepAnalysis.asleepUnspecified:
          acc.asleep += mins;
          break;
        default:
          break;
      }
    }

    for (const [key, acc] of byDay) {
      const day = dayMap.get(key);
      if (day) {
        day.sleep_asleep_minutes = acc.asleep;
        day.sleep_in_bed_minutes = acc.inBed;
        day.sleep_deep_minutes = acc.deep;
        day.sleep_rem_minutes = acc.rem;
        day.sleep_core_minutes = acc.core;
        day.sleep_awake_minutes = acc.awake;
      }

      sessions.push({
        provider_session_id: `sleep-${key}`,
        started_at: acc.startedAt.toISOString(),
        ended_at: acc.endedAt.toISOString(),
        asleep_minutes: acc.asleep,
        in_bed_minutes: acc.inBed,
        deep_minutes: acc.deep,
        rem_minutes: acc.rem,
        core_minutes: acc.core,
        awake_minutes: acc.awake,
        source_name: "Apple Health",
        raw_payload: { summary_date: key },
      });
    }
  } catch (error) {
    console.warn("[healthkit] sleep failed", error);
  }

  return sessions;
}

async function collectWorkouts(
  start: Date,
  end: Date,
): Promise<WorkoutRow[]> {
  try {
    const workouts = await queryWorkoutSamples({
      limit: 200,
      ascending: false,
      filter: { startDate: start, endDate: end },
    });

    return workouts.map((workout) => {
      const json = workout.toJSON();
      const durationSec = json.duration?.quantity
        ? Math.round(json.duration.quantity)
        : minutesBetween(new Date(json.startDate), new Date(json.endDate)) * 60;

      return {
        provider_activity_id: json.uuid,
        activity_type: mapWorkoutActivityType(json.workoutActivityType),
        name: workoutDisplayName(json.workoutActivityType),
        started_at: new Date(json.startDate).toISOString(),
        ended_at: new Date(json.endDate).toISOString(),
        duration_seconds: durationSec,
        distance_meters: json.totalDistance?.quantity ?? null,
        calories_burned: json.totalEnergyBurned?.quantity
          ? Math.round(json.totalEnergyBurned.quantity)
          : null,
        raw_payload: {
          uuid: json.uuid,
          workoutActivityType: json.workoutActivityType,
          duration: json.duration,
          totalDistance: json.totalDistance,
          totalEnergyBurned: json.totalEnergyBurned,
          metadata: json.metadata ?? {},
        },
      };
    });
  } catch (error) {
    console.warn("[healthkit] workouts failed", error);
    return [];
  }
}

async function collectMetricSamples(
  start: Date,
  end: Date,
): Promise<MetricSampleRow[]> {
  const rows: MetricSampleRow[] = [];

  for (const metric of SAMPLE_METRICS) {
    try {
      const samples = await queryQuantitySamples(metric.identifier, {
        ascending: false,
        limit: HEALTHKIT_SAMPLE_LIMIT,
        unit: metric.unit,
        filter: { startDate: start, endDate: end },
      });

      for (const sample of samples) {
        rows.push({
          provider_sample_id: sample.uuid,
          metric_type: metric.metricType,
          recorded_at: new Date(sample.startDate).toISOString(),
          ended_at: new Date(sample.endDate).toISOString(),
          value: sample.quantity,
          unit: sample.unit,
          source_name: sample.sourceRevision?.source?.name ?? null,
          source_bundle_id:
            sample.sourceRevision?.source?.bundleIdentifier ?? null,
          raw_payload: {
            uuid: sample.uuid,
            quantityType: sample.quantityType,
            metadata: sample.metadata ?? {},
          },
        });
      }
    } catch (error) {
      console.warn(`[healthkit] samples ${metric.metricType} failed`, error);
    }
  }

  return rows;
}

async function collectWeights(
  start: Date,
  end: Date,
): Promise<WeightSampleRow[]> {
  try {
    const [massSamples, fatSamples] = await Promise.all([
      queryQuantitySamples("HKQuantityTypeIdentifierBodyMass", {
        ascending: false,
        limit: 100,
        unit: "kg",
        filter: { startDate: start, endDate: end },
      }),
      queryQuantitySamples("HKQuantityTypeIdentifierBodyFatPercentage", {
        ascending: false,
        limit: 100,
        unit: "%",
        filter: { startDate: start, endDate: end },
      }),
    ]);

    const fatByDay = new Map<string, number>();
    for (const fat of fatSamples) {
      // HealthKit may return fraction (0.17) or percent (17) depending on unit.
      const pct = fat.quantity <= 1 ? fat.quantity * 100 : fat.quantity;
      fatByDay.set(toDateKey(new Date(fat.startDate)), pct);
    }

    return massSamples.map((sample) => ({
      provider_sample_id: sample.uuid,
      logged_at: new Date(sample.startDate).toISOString(),
      weight_kg: sample.quantity,
      body_fat_percent:
        fatByDay.get(toDateKey(new Date(sample.startDate))) ?? null,
    }));
  } catch (error) {
    console.warn("[healthkit] weight failed", error);
    return [];
  }
}

/** Read a HealthKit snapshot for the given lookback window (days). */
export async function readHealthKitSnapshot(
  lookbackDays: number = HEALTHKIT_FULL_LOOKBACK_DAYS,
): Promise<HealthKitSnapshot> {
  const { start, end } = lookbackWindow(lookbackDays);
  const dayMap = emptyDayMap(start, end);

  await collectDailyQuantities(dayMap, start, end);
  await collectStandHours(dayMap, start, end);
  await collectMindfulness(dayMap, start, end);
  const sleepSessions = await collectSleep(dayMap, start, end);

  const [workouts, samples, weights] = await Promise.all([
    collectWorkouts(start, end),
    collectMetricSamples(start, end),
    collectWeights(start, end),
  ]);

  // Drop empty day rows that only have the sync timestamp
  const daily = [...dayMap.values()].filter((day) => {
    const keys = Object.keys(day).filter(
      (k) => k !== "summary_date" && k !== "apple_health_synced_at",
    );
    return keys.some((k) => (day as Record<string, unknown>)[k] != null);
  });

  return { daily, workouts, samples, weights, sleepSessions };
}

/** Convenience: today's step count for UI chips. */
export async function getTodayStepCount(): Promise<number | null> {
  try {
    const start = startOfLocalDay(new Date());
    const stats = await queryStatisticsForQuantity(
      "HKQuantityTypeIdentifierStepCount",
      ["cumulativeSum"],
      {
        unit: "count",
        filter: { startDate: start, endDate: new Date() },
      },
    );
    return stats.sumQuantity?.quantity != null
      ? Math.round(stats.sumQuantity.quantity)
      : null;
  } catch {
    return null;
  }
}
