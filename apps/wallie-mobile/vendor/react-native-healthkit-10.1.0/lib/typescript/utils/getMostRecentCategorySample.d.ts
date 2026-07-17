import type { CategoryTypeIdentifier } from '../types/CategoryTypeIdentifier';
export declare function getMostRecentCategorySample<T extends CategoryTypeIdentifier>(identifier: T): Promise<import("..").CategorySampleTyped<T> | undefined>;
export default getMostRecentCategorySample;
