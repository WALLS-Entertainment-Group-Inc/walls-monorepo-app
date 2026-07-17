import type { QuantityTypeIdentifier } from '../types/QuantityTypeIdentifier';
declare function getQuantitySampleById(identifier: QuantityTypeIdentifier, uuid: string, unit?: string): Promise<import("..").QuantitySample | undefined>;
export default getQuantitySampleById;
