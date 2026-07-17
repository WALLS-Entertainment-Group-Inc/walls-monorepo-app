"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modules_1 = require("../modules");
async function getMostRecentQuantitySample(identifier, unit) {
    const samples = await modules_1.QuantityTypes.queryQuantitySamples(identifier, {
        limit: 1,
        unit,
    });
    return samples[0];
}
exports.default = getMostRecentQuantitySample;
