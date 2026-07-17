import { useEffect, useRef } from 'react';
import { subscribeToChanges } from '../utils/subscribeToChanges';
export function useSubscribeToChanges(identifier, onChange) {
    const onChangeRef = useRef(onChange);
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);
    useEffect(() => {
        const subscription = subscribeToChanges(identifier, (args) => {
            onChangeRef.current(args);
        });
        return () => {
            subscription.remove();
        };
    }, [identifier]);
}
export default useSubscribeToChanges;
