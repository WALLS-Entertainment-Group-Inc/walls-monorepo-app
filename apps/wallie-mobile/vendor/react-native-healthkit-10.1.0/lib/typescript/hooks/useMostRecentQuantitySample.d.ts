import type { QuantitySample } from '../types/QuantitySample';
import type { QuantityTypeIdentifier } from '../types/QuantityTypeIdentifier';
/**
 * @returns the most recent sample for the given quantity type.
 */
export declare function useMostRecentQuantitySample(identifier: QuantityTypeIdentifier, unit?: string): QuantitySample | undefined;
export default useMostRecentQuantitySample;
