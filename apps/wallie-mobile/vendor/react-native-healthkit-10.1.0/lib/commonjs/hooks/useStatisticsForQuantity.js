"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStatisticsForQuantity = useStatisticsForQuantity;
const react_1 = require("react");
const modules_1 = require("../modules");
const useSubscribeToChanges_1 = __importDefault(require("./useSubscribeToChanges"));
function useStatisticsForQuantity(identifier, options, from, to, unit) {
    const [result, setResult] = (0, react_1.useState)(null);
    const optionsRef = (0, react_1.useRef)(options);
    (0, react_1.useEffect)(() => {
        optionsRef.current = options;
    }, [options]);
    const update = (0, react_1.useCallback)(async () => {
        const res = await modules_1.QuantityTypes.queryStatisticsForQuantity(identifier, optionsRef.current, { filter: { startDate: from, endDate: to }, unit });
        setResult(res);
    }, [identifier, from, to, unit]);
    (0, react_1.useEffect)(() => {
        void update();
    }, [update]);
    (0, useSubscribeToChanges_1.default)(identifier, update);
    return result;
}
exports.default = useStatisticsForQuantity;
