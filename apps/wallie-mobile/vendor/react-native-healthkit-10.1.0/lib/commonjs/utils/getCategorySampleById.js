"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategorySampleById = getCategorySampleById;
const modules_1 = require("../modules");
async function getCategorySampleById(identifier, uuid) {
    const samples = await modules_1.CategoryTypes.queryCategorySamples(identifier, {
        limit: 1,
        filter: { uuid: uuid },
    });
    return samples[0];
}
exports.default = getCategorySampleById;
