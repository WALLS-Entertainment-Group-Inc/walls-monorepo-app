import type {
  CategoryTypeIdentifier,
  ObjectTypeIdentifier,
  QuantityTypeIdentifier,
  SampleTypeIdentifierWriteable,
} from "@kingstinct/react-native-healthkit";

/**
 * Broad read set — Wallie asks for as much HealthKit coverage as Apple allows.
 * Users can deny individual types in the iOS permission sheet.
 */
export const HEALTHKIT_READ_TYPES: readonly ObjectTypeIdentifier[] = [
  // Activity / energy
  "HKQuantityTypeIdentifierStepCount",
  "HKQuantityTypeIdentifierDistanceWalkingRunning",
  "HKQuantityTypeIdentifierDistanceCycling",
  "HKQuantityTypeIdentifierDistanceSwimming",
  "HKQuantityTypeIdentifierFlightsClimbed",
  "HKQuantityTypeIdentifierActiveEnergyBurned",
  "HKQuantityTypeIdentifierBasalEnergyBurned",
  "HKQuantityTypeIdentifierAppleExerciseTime",
  "HKQuantityTypeIdentifierAppleStandTime",
  "HKCategoryTypeIdentifierAppleStandHour",
  "HKQuantityTypeIdentifierVO2Max",
  "HKWorkoutTypeIdentifier",

  // Heart / vitals
  "HKQuantityTypeIdentifierHeartRate",
  "HKQuantityTypeIdentifierRestingHeartRate",
  "HKQuantityTypeIdentifierWalkingHeartRateAverage",
  "HKQuantityTypeIdentifierHeartRateVariabilitySDNN",
  "HKQuantityTypeIdentifierRespiratoryRate",
  "HKQuantityTypeIdentifierOxygenSaturation",
  "HKQuantityTypeIdentifierBodyTemperature",
  "HKQuantityTypeIdentifierBloodPressureSystolic",
  "HKQuantityTypeIdentifierBloodPressureDiastolic",
  "HKQuantityTypeIdentifierBloodGlucose",

  // Body measurements
  "HKQuantityTypeIdentifierBodyMass",
  "HKQuantityTypeIdentifierBodyFatPercentage",
  "HKQuantityTypeIdentifierLeanBodyMass",
  "HKQuantityTypeIdentifierHeight",
  "HKQuantityTypeIdentifierBodyMassIndex",
  "HKQuantityTypeIdentifierWaistCircumference",

  // Sleep / mindfulness
  "HKCategoryTypeIdentifierSleepAnalysis",
  "HKCategoryTypeIdentifierMindfulSession",

  // Nutrition (dietary water + energy if logged in Health)
  "HKQuantityTypeIdentifierDietaryWater",
  "HKQuantityTypeIdentifierDietaryEnergyConsumed",
  "HKQuantityTypeIdentifierDietaryProtein",
  "HKQuantityTypeIdentifierDietaryCarbohydrates",
  "HKQuantityTypeIdentifierDietaryFatTotal",
] as const;

/** Read-only — Wallie does not write back into Apple Health. */
export const HEALTHKIT_WRITE_TYPES: readonly SampleTypeIdentifierWriteable[] =
  [];

export type DailyCumulativeMetric = {
  column:
    | "steps"
    | "distance_walking_meters"
    | "flights_climbed"
    | "active_energy_kcal"
    | "basal_energy_kcal"
    | "exercise_minutes"
    | "stand_minutes"
    | "mindfulness_minutes";
  identifier: QuantityTypeIdentifier | CategoryTypeIdentifier;
  unit?: string;
  /** Convert HealthKit quantity → stored number (e.g. seconds → minutes). */
  transform?: (quantity: number) => number;
  kind: "cumulative" | "discreteAverage";
};

export const DAILY_QUANTITY_METRICS: readonly DailyCumulativeMetric[] = [
  {
    column: "steps",
    identifier: "HKQuantityTypeIdentifierStepCount",
    unit: "count",
    kind: "cumulative",
  },
  {
    column: "distance_walking_meters",
    identifier: "HKQuantityTypeIdentifierDistanceWalkingRunning",
    unit: "m",
    kind: "cumulative",
  },
  {
    column: "flights_climbed",
    identifier: "HKQuantityTypeIdentifierFlightsClimbed",
    unit: "count",
    kind: "cumulative",
  },
  {
    column: "active_energy_kcal",
    identifier: "HKQuantityTypeIdentifierActiveEnergyBurned",
    unit: "kcal",
    kind: "cumulative",
    transform: (q) => Math.round(q),
  },
  {
    column: "basal_energy_kcal",
    identifier: "HKQuantityTypeIdentifierBasalEnergyBurned",
    unit: "kcal",
    kind: "cumulative",
    transform: (q) => Math.round(q),
  },
  {
    column: "exercise_minutes",
    identifier: "HKQuantityTypeIdentifierAppleExerciseTime",
    unit: "min",
    kind: "cumulative",
    transform: (q) => Math.round(q),
  },
  {
    column: "stand_minutes",
    identifier: "HKQuantityTypeIdentifierAppleStandTime",
    unit: "min",
    kind: "cumulative",
    transform: (q) => Math.round(q),
  },
];

export type DailyDiscreteMetric = {
  column:
    | "resting_heart_rate"
    | "avg_heart_rate"
    | "walking_heart_rate_avg"
    | "hrv_sdnn_ms"
    | "respiratory_rate"
    | "oxygen_saturation"
    | "body_temperature_c"
    | "blood_glucose_mg_dl"
    | "vo2_max";
  identifier: QuantityTypeIdentifier;
  unit?: string;
  transform?: (quantity: number) => number;
};

export const DAILY_DISCRETE_METRICS: readonly DailyDiscreteMetric[] = [
  {
    column: "resting_heart_rate",
    identifier: "HKQuantityTypeIdentifierRestingHeartRate",
    unit: "count/min",
    transform: (q) => Math.round(q),
  },
  {
    column: "avg_heart_rate",
    identifier: "HKQuantityTypeIdentifierHeartRate",
    unit: "count/min",
    transform: (q) => Math.round(q),
  },
  {
    column: "walking_heart_rate_avg",
    identifier: "HKQuantityTypeIdentifierWalkingHeartRateAverage",
    unit: "count/min",
    transform: (q) => Math.round(q),
  },
  {
    column: "hrv_sdnn_ms",
    identifier: "HKQuantityTypeIdentifierHeartRateVariabilitySDNN",
    unit: "ms",
  },
  {
    column: "respiratory_rate",
    identifier: "HKQuantityTypeIdentifierRespiratoryRate",
    unit: "count/min",
  },
  {
    column: "oxygen_saturation",
    identifier: "HKQuantityTypeIdentifierOxygenSaturation",
    unit: "%",
  },
  {
    column: "body_temperature_c",
    identifier: "HKQuantityTypeIdentifierBodyTemperature",
    unit: "degC",
  },
  {
    column: "blood_glucose_mg_dl",
    identifier: "HKQuantityTypeIdentifierBloodGlucose",
    unit: "mg/dL",
  },
  {
    column: "vo2_max",
    identifier: "HKQuantityTypeIdentifierVO2Max",
    unit: "ml/(kg*min)",
  },
];

/** Sample types we persist into health_metric_samples (recent window). */
export const SAMPLE_METRICS: readonly {
  metricType: string;
  identifier: QuantityTypeIdentifier;
  unit?: string;
}[] = [
  {
    metricType: "heart_rate",
    identifier: "HKQuantityTypeIdentifierHeartRate",
    unit: "count/min",
  },
  {
    metricType: "resting_heart_rate",
    identifier: "HKQuantityTypeIdentifierRestingHeartRate",
    unit: "count/min",
  },
  {
    metricType: "hrv_sdnn",
    identifier: "HKQuantityTypeIdentifierHeartRateVariabilitySDNN",
    unit: "ms",
  },
  {
    metricType: "oxygen_saturation",
    identifier: "HKQuantityTypeIdentifierOxygenSaturation",
    unit: "%",
  },
  {
    metricType: "respiratory_rate",
    identifier: "HKQuantityTypeIdentifierRespiratoryRate",
    unit: "count/min",
  },
  {
    metricType: "blood_glucose",
    identifier: "HKQuantityTypeIdentifierBloodGlucose",
    unit: "mg/dL",
  },
  {
    metricType: "body_temperature",
    identifier: "HKQuantityTypeIdentifierBodyTemperature",
    unit: "degC",
  },
  {
    metricType: "blood_pressure_systolic",
    identifier: "HKQuantityTypeIdentifierBloodPressureSystolic",
    unit: "mmHg",
  },
  {
    metricType: "blood_pressure_diastolic",
    identifier: "HKQuantityTypeIdentifierBloodPressureDiastolic",
    unit: "mmHg",
  },
];
