import { CategoryTypes } from '../modules';
export async function getCategorySampleById(identifier, uuid) {
    const samples = await CategoryTypes.queryCategorySamples(identifier, {
        limit: 1,
        filter: { uuid: uuid },
    });
    return samples[0];
}
export default getCategorySampleById;
