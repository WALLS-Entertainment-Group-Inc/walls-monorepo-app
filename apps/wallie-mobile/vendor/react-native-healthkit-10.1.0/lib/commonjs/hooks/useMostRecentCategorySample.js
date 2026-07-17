"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMostRecentCategorySample = useMostRecentCategorySample;
const react_1 = require("react");
const getMostRecentCategorySample_1 = __importDefault(require("../utils/getMostRecentCategorySample"));
const useSubscribeToChanges_1 = __importDefault(require("./useSubscribeToChanges"));
/**
 * @returns the most recent sample for the given category type.
 */
function useMostRecentCategorySample(identifier) {
    const [category, setCategory] = (0, react_1.useState)();
    const updater = (0, react_1.useCallback)(() => {
        void (0, getMostRecentCategorySample_1.default)(identifier).then(setCategory);
    }, [identifier]);
    (0, useSubscribeToChanges_1.default)(identifier, updater);
    return category;
}
exports.default = useMostRecentCategorySample;
