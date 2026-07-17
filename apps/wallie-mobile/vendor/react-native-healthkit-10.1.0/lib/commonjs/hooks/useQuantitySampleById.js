"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQuantitySampleById = useQuantitySampleById;
const react_1 = require("react");
const getQuantitySampleById_1 = __importDefault(require("../utils/getQuantitySampleById"));
const useSubscribeToChanges_1 = __importDefault(require("./useSubscribeToChanges"));
/**
 * @returns the most recent sample for the given quantity type.
 */
function useQuantitySampleById(identifier, uuid, options = {}) {
    const [sample, setSample] = (0, react_1.useState)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchMostRecentSample = (0, react_1.useCallback)(async () => {
        setIsLoading(true);
        try {
            const sample = await (0, getQuantitySampleById_1.default)(identifier, uuid, options?.unit);
            setSample(sample);
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
        }
        finally {
            setIsLoading(false);
        }
    }, [identifier, uuid, options.unit]);
    (0, useSubscribeToChanges_1.default)(identifier, fetchMostRecentSample);
    return { sample, isLoading, error };
}
exports.default = useQuantitySampleById;
