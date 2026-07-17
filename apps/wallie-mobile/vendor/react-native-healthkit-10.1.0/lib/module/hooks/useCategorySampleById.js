import { useCallback, useState } from 'react';
import getCategorySampleById from '../utils/getCategorySampleById';
import useSubscribeToChanges from './useSubscribeToChanges';
/**
 * @returns the most recent sample for the given category type.
 */
export function useCategorySampleById(identifier, uuid) {
    const [sample, setSample] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const updater = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedSample = await getCategorySampleById(identifier, uuid);
            setSample(fetchedSample);
        }
        catch (err) {
            setError(err instanceof Error
                ? err
                : new Error('Unknown error fetching category sample by ID'));
        }
        finally {
            setIsLoading(false);
        }
    }, [identifier, uuid]);
    useSubscribeToChanges(identifier, updater);
    return { sample, isLoading, error };
}
export default useCategorySampleById;
