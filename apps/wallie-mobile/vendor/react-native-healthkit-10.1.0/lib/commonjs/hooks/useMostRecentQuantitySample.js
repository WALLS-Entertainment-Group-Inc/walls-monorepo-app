"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMostRecentQuantitySample = useMostRecentQuantitySample;
const react_1 = require("react");
const getMostRecentQuantitySample_1 = __importDefault(require("../utils/getMostRecentQuantitySample"));
const useSubscribeToChanges_1 = __importDefault(require("./useSubscribeToChanges"));
/**
 * @returns the most recent sample for the given quantity type.
 */
function useMostRecentQuantitySample(identifier, unit) {
    const [lastSample, setLastSample] = (0, react_1.useState)();
    const fetchMostRecentSample = (0, react_1.useCallback)(async () => {
        const value = await (0, getMostRecentQuantitySample_1.default)(identifier, unit);
        setLastSample(value);
    }, [identifier, unit]);
    (0, useSubscribeToChanges_1.default)(identifier, fetchMostRecentSample);
    return lastSample;
}
exports.default = useMostRecentQuantitySample;
