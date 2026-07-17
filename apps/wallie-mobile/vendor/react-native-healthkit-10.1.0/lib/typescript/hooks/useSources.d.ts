import type { SourceProxy } from '../specs/SourceProxy.nitro';
import type { SampleTypeIdentifier } from '../types/Shared';
export declare function useSources<TIdentifier extends SampleTypeIdentifier>(identifier: TIdentifier): readonly SourceProxy[] | null;
export default useSources;
