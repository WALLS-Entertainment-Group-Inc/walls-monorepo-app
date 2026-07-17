import type { WorkoutQueryOptions } from '../types/Workouts';
declare const getMostRecentWorkout: (options: Pick<WorkoutQueryOptions, "distanceUnit" | "energyUnit">) => Promise<import("../specs/WorkoutProxy.nitro").WorkoutProxy | undefined>;
export default getMostRecentWorkout;
