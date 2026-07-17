"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCategorySampleById = useCategorySampleById;
const react_1 = require("react");
const getCategorySampleById_1 = __importDefault(require("../utils/getCategorySampleById"));
const useSubscribeToChanges_1 = __importDefault(require("./useSubscribeToChanges"));
/**
 * @returns the most recent sample for the given category type.
 */
function useCategorySampleById(identifier, uuid) {
    const [sample, setSample] = (0, react_1.useState)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const updater = (0, react_1.useCallback)(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedSample = await (0, getCategorySampleById_1.default)(identifier, uuid);
            setSample(fetchedSample);
        }
        catch (err) {
            setError(err instanceof Error
                ? err
                : new Error('Unknown error fetching category sample by ID'));
        }
        finally {
            setIsLoading(false);
        }
    }, [identifier, uuid]);
    (0, useSubscribeToChanges_1.default)(identifier, updater);
    return { sample, isLoading, error };
}
exports.default = useCategorySampleById;
