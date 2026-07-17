import type { CategoryTypeIdentifier } from '../types/CategoryTypeIdentifier';
export declare function getCategorySampleById<T extends CategoryTypeIdentifier>(identifier: T, uuid: string): Promise<import("..").CategorySampleTyped<T> | undefined>;
export default getCategorySampleById;
