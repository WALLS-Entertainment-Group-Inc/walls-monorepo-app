import type { QuantityTypeIdentifier } from '../types/QuantityTypeIdentifier';
declare const getPreferredUnit: (quantityType: QuantityTypeIdentifier) => Promise<string>;
export default getPreferredUnit;
