import type { SampleTypeIdentifier } from '../types/Shared';
import type { OnChangeCallbackArgs } from '../types/Subscriptions';
export declare const subscribeToChanges: (identifier: SampleTypeIdentifier, callback: (args: OnChangeCallbackArgs) => void) => {
    remove: () => boolean;
};
