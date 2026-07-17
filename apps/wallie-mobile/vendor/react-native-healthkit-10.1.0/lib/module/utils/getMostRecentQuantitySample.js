import { QuantityTypes } from '../modules';
async function getMostRecentQuantitySample(identifier, unit) {
    const samples = await QuantityTypes.queryQuantitySamples(identifier, {
        limit: 1,
        unit,
    });
    return samples[0];
}
export default getMostRecentQuantitySample;
