import { useCallback, useState } from 'react';
import getQuantitySampleById from '../utils/getQuantitySampleById';
import useSubscribeToChanges from './useSubscribeToChanges';
/**
 * @returns the most recent sample for the given quantity type.
 */
export function useQuantitySampleById(identifier, uuid, options = {}) {
    const [sample, setSample] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchMostRecentSample = useCallback(async () => {
        setIsLoading(true);
        try {
            const sample = await getQuantitySampleById(identifier, uuid, options?.unit);
            setSample(sample);
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
        }
        finally {
            setIsLoading(false);
        }
    }, [identifier, uuid, options.unit]);
    useSubscribeToChanges(identifier, fetchMostRecentSample);
    return { sample, isLoading, error };
}
export default useQuantitySampleById;
