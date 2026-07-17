import type { WorkoutActivityType } from "@kingstinct/react-native-healthkit";

type HealthActivityType =
  | "run"
  | "ride"
  | "swim"
  | "walk"
  | "hike"
  | "workout"
  | "yoga"
  | "strength"
  | "crossfit"
  | "sport"
  | "other";

const WORKOUT_TYPE_MAP: Partial<Record<WorkoutActivityType, HealthActivityType>> =
  {
    37: "run", // running
    13: "ride", // cycling
    46: "swim", // swimming
    52: "walk", // walking
    24: "hike", // hiking
    57: "yoga", // yoga
    20: "strength", // functionalStrengthTraining
    50: "strength", // traditionalStrengthTraining
    63: "crossfit", // highIntensityIntervalTraining
    11: "crossfit", // crossTraining
    16: "workout", // elliptical
    73: "workout", // mixedCardio
    59: "workout", // coreTraining
  };

const SPORT_TYPES = new Set<WorkoutActivityType>([
  1, 3, 4, 5, 6, 21, 25, 35, 36, 41, 48, 51, 79,
]);

export function mapWorkoutActivityType(
  type: WorkoutActivityType,
): HealthActivityType {
  if (WORKOUT_TYPE_MAP[type]) return WORKOUT_TYPE_MAP[type]!;
  if (SPORT_TYPES.has(type)) return "sport";
  return "other";
}

export function workoutDisplayName(type: WorkoutActivityType): string {
  const names: Partial<Record<number, string>> = {
    37: "Run",
    13: "Ride",
    46: "Swim",
    52: "Walk",
    24: "Hike",
    57: "Yoga",
    20: "Strength",
    50: "Strength",
    63: "HIIT",
    16: "Elliptical",
  };
  return names[type] ?? "Workout";
}

export function startOfLocalDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function minutesBetween(start: Date, end: Date): number {
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60_000));
}
