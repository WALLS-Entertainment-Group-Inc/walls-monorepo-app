"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modules_1 = require("../modules");
async function getQuantitySampleById(identifier, uuid, unit) {
    const samples = await modules_1.QuantityTypes.queryQuantitySamples(identifier, {
        limit: 1,
        unit,
        filter: {
            uuid: uuid,
        },
    });
    return samples[0];
}
exports.default = getQuantitySampleById;
