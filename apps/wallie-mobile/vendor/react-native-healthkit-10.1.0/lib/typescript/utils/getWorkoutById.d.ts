import type { WorkoutQueryOptions } from '../types/Workouts';
declare const getWorkoutById: (uuid: string, options: Pick<WorkoutQueryOptions, "distanceUnit" | "energyUnit">) => Promise<import("../specs/WorkoutProxy.nitro").WorkoutProxy | undefined>;
export default getWorkoutById;
