import { useCallback, useEffect, useRef, useState } from 'react';
import getWorkoutById from '../utils/getWorkoutById';
import useSubscribeToChanges from './useSubscribeToChanges';
/**
 * @returns the most recent workout sample.
 */
export function useWorkoutById(uuid, options) {
    const [workout, setWorkout] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const optionsRef = useRef(options);
    useEffect(() => {
        optionsRef.current = options;
    }, [options]);
    const update = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedWorkout = await getWorkoutById(uuid, {
                energyUnit: optionsRef.current?.energyUnit,
                distanceUnit: optionsRef.current?.distanceUnit,
            });
            setWorkout(fetchedWorkout);
        }
        catch (err) {
            setError(err instanceof Error
                ? err
                : new Error('Unknown error fetching workout by ID'));
        }
        finally {
            setIsLoading(false);
        }
    }, [uuid]);
    useEffect(() => {
        void update();
    }, [update]);
    useSubscribeToChanges('HKWorkoutTypeIdentifier', update);
    return { workout, isLoading, error };
}
export default useWorkoutById;
