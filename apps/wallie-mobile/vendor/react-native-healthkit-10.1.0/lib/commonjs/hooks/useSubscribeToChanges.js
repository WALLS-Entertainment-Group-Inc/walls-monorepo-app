"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSubscribeToChanges = useSubscribeToChanges;
const react_1 = require("react");
const subscribeToChanges_1 = require("../utils/subscribeToChanges");
function useSubscribeToChanges(identifier, onChange) {
    const onChangeRef = (0, react_1.useRef)(onChange);
    (0, react_1.useEffect)(() => {
        onChangeRef.current = onChange;
    }, [onChange]);
    (0, react_1.useEffect)(() => {
        const subscription = (0, subscribeToChanges_1.subscribeToChanges)(identifier, (args) => {
            onChangeRef.current(args);
        });
        return () => {
            subscription.remove();
        };
    }, [identifier]);
}
exports.default = useSubscribeToChanges;
