import {
  disableAllBackgroundDelivery,
  enableBackgroundDelivery,
  subscribeToChanges,
  unsubscribeQueries,
  type ObjectTypeIdentifier,
  type SampleTypeIdentifier,
} from "@kingstinct/react-native-healthkit";
import { Platform } from "react-native";

import { HEALTHKIT_SYNC_DEBOUNCE_MS } from "./constants";

/** Mirrors HKUpdateFrequency without relying on the enum export shape. */
const UpdateFrequency = {
  immediate: 1,
  hourly: 2,
  daily: 3,
  weekly: 4,
} as const;

type Frequency = (typeof UpdateFrequency)[keyof typeof UpdateFrequency];

/**
 * Types we ask HealthKit to wake us for. Hourly is the battery-friendly
 * sweet spot — Apple still coalesces, and we debounce further in JS.
 */
const BACKGROUND_DELIVERY_TYPES: readonly {
  type: ObjectTypeIdentifier;
  frequency: Frequency;
}[] = [
  { type: "HKQuantityTypeIdentifierStepCount", frequency: UpdateFrequency.hourly },
  {
    type: "HKQuantityTypeIdentifierActiveEnergyBurned",
    frequency: UpdateFrequency.hourly,
  },
  {
    type: "HKQuantityTypeIdentifierAppleExerciseTime",
    frequency: UpdateFrequency.hourly,
  },
  { type: "HKQuantityTypeIdentifierHeartRate", frequency: UpdateFrequency.hourly },
  {
    type: "HKQuantityTypeIdentifierRestingHeartRate",
    frequency: UpdateFrequency.hourly,
  },
  { type: "HKWorkoutTypeIdentifier", frequency: UpdateFrequency.hourly },
  {
    type: "HKCategoryTypeIdentifierSleepAnalysis",
    frequency: UpdateFrequency.hourly,
  },
  { type: "HKQuantityTypeIdentifierBodyMass", frequency: UpdateFrequency.daily },
  {
    type: "HKQuantityTypeIdentifierOxygenSaturation",
    frequency: UpdateFrequency.hourly,
  },
];

/** Observer subscriptions — fire when samples change while the app can run. */
const OBSERVER_TYPES: readonly SampleTypeIdentifier[] = [
  "HKQuantityTypeIdentifierStepCount",
  "HKQuantityTypeIdentifierActiveEnergyBurned",
  "HKQuantityTypeIdentifierHeartRate",
  "HKWorkoutTypeIdentifier",
  "HKCategoryTypeIdentifierSleepAnalysis",
  "HKQuantityTypeIdentifierBodyMass",
];

type SyncTrigger = () => void;
type Remover = () => void;

let observerQueryIds: string[] = [];
let observerRemovers: Remover[] = [];
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let started = false;

function clearDebounce() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
}

function scheduleDebouncedSync(onSyncNeeded: SyncTrigger) {
  clearDebounce();
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    onSyncNeeded();
  }, HEALTHKIT_SYNC_DEBOUNCE_MS);
}

/**
 * Register HealthKit background delivery + change observers.
 * Safe to call repeatedly; no-ops if already running.
 */
export async function startAppleHealthBackgroundSync(
  onSyncNeeded: SyncTrigger,
): Promise<void> {
  if (Platform.OS !== "ios" || started) return;
  started = true;

  for (const { type, frequency } of BACKGROUND_DELIVERY_TYPES) {
    try {
      await enableBackgroundDelivery(type, frequency as never);
    } catch (error) {
      console.warn(`[healthkit] background delivery failed for ${type}`, error);
    }
  }

  for (const type of OBSERVER_TYPES) {
    try {
      const subscription = subscribeToChanges(type, () => {
        scheduleDebouncedSync(onSyncNeeded);
      }) as string | { remove: Remover };

      if (typeof subscription === "string") {
        observerQueryIds.push(subscription);
      } else if (subscription && typeof subscription.remove === "function") {
        observerRemovers.push(subscription.remove);
      }
    } catch (error) {
      console.warn(`[healthkit] observer failed for ${type}`, error);
    }
  }
}

/** Tear down observers + background delivery (e.g. on disconnect). */
export async function stopAppleHealthBackgroundSync(): Promise<void> {
  clearDebounce();
  started = false;

  const ids = observerQueryIds;
  const removers = observerRemovers;
  observerQueryIds = [];
  observerRemovers = [];

  for (const remove of removers) {
    try {
      remove();
    } catch {
      // ignore
    }
  }

  if (ids.length > 0) {
    try {
      unsubscribeQueries(ids);
    } catch {
      // ignore
    }
  }

  if (Platform.OS !== "ios") return;

  try {
    await disableAllBackgroundDelivery();
  } catch (error) {
    console.warn("[healthkit] disable background delivery failed", error);
  }
}
