import type { QueryStatisticsResponse, StatisticsOptions } from '../types/QuantityType';
import type { QuantityTypeIdentifier } from '../types/QuantityTypeIdentifier';
export declare function useStatisticsForQuantity<TIdentifier extends QuantityTypeIdentifier>(identifier: TIdentifier, options: readonly StatisticsOptions[], from: Date, to?: Date, unit?: string): QueryStatisticsResponse | null;
export default useStatisticsForQuantity;
