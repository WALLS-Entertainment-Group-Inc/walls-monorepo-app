import { useCallback, useState } from 'react';
import getMostRecentCategorySample from '../utils/getMostRecentCategorySample';
import useSubscribeToChanges from './useSubscribeToChanges';
/**
 * @returns the most recent sample for the given category type.
 */
export function useMostRecentCategorySample(identifier) {
    const [category, setCategory] = useState();
    const updater = useCallback(() => {
        void getMostRecentCategorySample(identifier).then(setCategory);
    }, [identifier]);
    useSubscribeToChanges(identifier, updater);
    return category;
}
export default useMostRecentCategorySample;
