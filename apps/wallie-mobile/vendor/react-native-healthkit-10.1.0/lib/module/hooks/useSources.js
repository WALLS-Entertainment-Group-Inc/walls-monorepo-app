import { useCallback, useEffect, useState } from 'react';
import { Core } from '../modules';
export function useSources(identifier) {
    const [result, setResult] = useState(null);
    const update = useCallback(async () => {
        const res = await Core.querySources(identifier);
        setResult(res);
    }, [identifier]);
    useEffect(() => {
        void update();
    }, [update]);
    return result;
}
export default useSources;
