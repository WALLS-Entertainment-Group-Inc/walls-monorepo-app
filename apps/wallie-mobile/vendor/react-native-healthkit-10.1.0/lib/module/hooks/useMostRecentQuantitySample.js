import { useCallback, useState } from 'react';
import getMostRecentQuantitySample from '../utils/getMostRecentQuantitySample';
import useSubscribeToChanges from './useSubscribeToChanges';
/**
 * @returns the most recent sample for the given quantity type.
 */
export function useMostRecentQuantitySample(identifier, unit) {
    const [lastSample, setLastSample] = useState();
    const fetchMostRecentSample = useCallback(async () => {
        const value = await getMostRecentQuantitySample(identifier, unit);
        setLastSample(value);
    }, [identifier, unit]);
    useSubscribeToChanges(identifier, fetchMostRecentSample);
    return lastSample;
}
export default useMostRecentQuantitySample;
