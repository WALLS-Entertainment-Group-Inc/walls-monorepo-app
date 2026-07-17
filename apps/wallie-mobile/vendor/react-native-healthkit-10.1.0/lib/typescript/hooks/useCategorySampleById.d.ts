import type { CategorySampleTyped } from '../types/CategoryType';
import type { CategoryTypeIdentifier } from '../types/CategoryTypeIdentifier';
/**
 * @returns the most recent sample for the given category type.
 */
export declare function useCategorySampleById<T extends CategoryTypeIdentifier>(identifier: T, uuid: string): {
    sample: CategorySampleTyped<T> | undefined;
    isLoading: boolean;
    error: Error | null;
};
export default useCategorySampleById;
