import type { SampleTypeIdentifier } from '../types/Shared';
import type { OnChangeCallbackArgs } from '../types/Subscriptions';
export declare function useSubscribeToChanges<TIdentifier extends SampleTypeIdentifier>(identifier: TIdentifier, onChange: (args: OnChangeCallbackArgs) => void): void;
export default useSubscribeToChanges;
