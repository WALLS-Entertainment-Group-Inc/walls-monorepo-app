"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modules_1 = require("../modules");
const getPreferredUnit = async (quantityType) => {
    const units = await modules_1.Core.getPreferredUnits([quantityType]);
    const unit = units[0]?.unit;
    if (!unit) {
        throw new Error(`No preferred unit found for quantity type: ${quantityType}`);
    }
    return unit;
};
exports.default = getPreferredUnit;
