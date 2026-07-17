import type { QuantityTypeIdentifier } from '../types/QuantityTypeIdentifier';
declare function getMostRecentQuantitySample(identifier: QuantityTypeIdentifier, unit?: string): Promise<import("..").QuantitySample | undefined>;
export default getMostRecentQuantitySample;
