import type { QuantitySample } from '../types/QuantitySample';
import type { QuantityTypeIdentifier } from '../types/QuantityTypeIdentifier';
/**
 * @returns the most recent sample for the given quantity type.
 */
export declare function useQuantitySampleById(identifier: QuantityTypeIdentifier, uuid: string, options?: {
    /** The unit to use for the sample. */
    unit?: string;
}): {
    sample: QuantitySample | undefined;
    isLoading: boolean;
    error: Error | null;
};
export default useQuantitySampleById;
