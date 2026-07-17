import type { WorkoutProxy } from '../specs/WorkoutProxy.nitro';
/**
 * @returns the most recent workout sample.
 */
export declare function useWorkoutById(uuid: string, options?: {
    readonly energyUnit?: string;
    readonly distanceUnit?: string;
}): {
    workout: WorkoutProxy | undefined;
    isLoading: boolean;
    error: Error | null;
};
export default useWorkoutById;
