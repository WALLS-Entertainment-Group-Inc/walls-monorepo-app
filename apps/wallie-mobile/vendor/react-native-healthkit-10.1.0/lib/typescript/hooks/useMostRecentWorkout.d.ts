import type { WorkoutProxy } from '../specs/WorkoutProxy.nitro';
/**
 * @returns the most recent workout sample.
 */
export declare function useMostRecentWorkout(options?: {
    readonly energyUnit?: string;
    readonly distanceUnit?: string;
}): WorkoutProxy | undefined;
export default useMostRecentWorkout;
