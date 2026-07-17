import { useCallback, useEffect, useRef, useState } from 'react';
import { QuantityTypes } from '../modules';
import useSubscribeToChanges from './useSubscribeToChanges';
export function useStatisticsForQuantity(identifier, options, from, to, unit) {
    const [result, setResult] = useState(null);
    const optionsRef = useRef(options);
    useEffect(() => {
        optionsRef.current = options;
    }, [options]);
    const update = useCallback(async () => {
        const res = await QuantityTypes.queryStatisticsForQuantity(identifier, optionsRef.current, { filter: { startDate: from, endDate: to }, unit });
        setResult(res);
    }, [identifier, from, to, unit]);
    useEffect(() => {
        void update();
    }, [update]);
    useSubscribeToChanges(identifier, update);
    return result;
}
export default useStatisticsForQuantity;
