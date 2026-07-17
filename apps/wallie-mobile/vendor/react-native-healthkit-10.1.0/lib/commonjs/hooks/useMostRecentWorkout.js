"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMostRecentWorkout = useMostRecentWorkout;
const react_1 = require("react");
const getMostRecentWorkout_1 = __importDefault(require("../utils/getMostRecentWorkout"));
const useSubscribeToChanges_1 = __importDefault(require("./useSubscribeToChanges"));
/**
 * @returns the most recent workout sample.
 */
function useMostRecentWorkout(options) {
    const [workout, setWorkout] = (0, react_1.useState)();
    const optionsRef = (0, react_1.useRef)(options);
    (0, react_1.useEffect)(() => {
        optionsRef.current = options;
    }, [options]);
    const update = (0, react_1.useCallback)(async () => {
        setWorkout(await (0, getMostRecentWorkout_1.default)({
            energyUnit: optionsRef.current?.energyUnit,
            distanceUnit: optionsRef.current?.distanceUnit,
        }));
    }, []);
    (0, react_1.useEffect)(() => {
        void update();
    }, [update]);
    (0, useSubscribeToChanges_1.default)('HKWorkoutTypeIdentifier', update);
    return workout;
}
exports.default = useMostRecentWorkout;
