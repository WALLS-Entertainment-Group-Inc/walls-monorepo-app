import { QuantityTypes } from '../modules';
async function getQuantitySampleById(identifier, uuid, unit) {
    const samples = await QuantityTypes.queryQuantitySamples(identifier, {
        limit: 1,
        unit,
        filter: {
            uuid: uuid,
        },
    });
    return samples[0];
}
export default getQuantitySampleById;
