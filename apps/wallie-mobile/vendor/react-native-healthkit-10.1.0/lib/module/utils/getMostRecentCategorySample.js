import { CategoryTypes } from '../modules';
export async function getMostRecentCategorySample(identifier) {
    const samples = await CategoryTypes.queryCategorySamples(identifier, {
        limit: 1,
        ascending: false,
    });
    return samples[0];
}
export default getMostRecentCategorySample;
