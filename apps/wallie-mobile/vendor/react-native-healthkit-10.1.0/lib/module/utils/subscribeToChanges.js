import { Core } from '../modules';
export const subscribeToChanges = (identifier, callback) => {
    const queryId = Core.subscribeToObserverQuery(identifier, callback);
    return {
        remove: () => Core.unsubscribeQuery(queryId),
    };
};
