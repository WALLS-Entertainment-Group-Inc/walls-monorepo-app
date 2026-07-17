"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSources = useSources;
const react_1 = require("react");
const modules_1 = require("../modules");
function useSources(identifier) {
    const [result, setResult] = (0, react_1.useState)(null);
    const update = (0, react_1.useCallback)(async () => {
        const res = await modules_1.Core.querySources(identifier);
        setResult(res);
    }, [identifier]);
    (0, react_1.useEffect)(() => {
        void update();
    }, [update]);
    return result;
}
exports.default = useSources;
