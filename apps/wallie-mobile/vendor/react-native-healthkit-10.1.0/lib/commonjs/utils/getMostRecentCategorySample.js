"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMostRecentCategorySample = getMostRecentCategorySample;
const modules_1 = require("../modules");
async function getMostRecentCategorySample(identifier) {
    const samples = await modules_1.CategoryTypes.queryCategorySamples(identifier, {
        limit: 1,
        ascending: false,
    });
    return samples[0];
}
exports.default = getMostRecentCategorySample;
