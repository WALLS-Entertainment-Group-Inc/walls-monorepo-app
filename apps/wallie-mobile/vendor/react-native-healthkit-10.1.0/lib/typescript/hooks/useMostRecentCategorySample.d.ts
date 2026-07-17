import type { CategorySampleTyped } from '../types/CategoryType';
import type { CategoryTypeIdentifier } from '../types/CategoryTypeIdentifier';
/**
 * @returns the most recent sample for the given category type.
 */
export declare function useMostRecentCategorySample<T extends CategoryTypeIdentifier>(identifier: T): CategorySampleTyped<T> | undefined;
export default useMostRecentCategorySample;
