"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkoutById = useWorkoutById;
const react_1 = require("react");
const getWorkoutById_1 = __importDefault(require("../utils/getWorkoutById"));
const useSubscribeToChanges_1 = __importDefault(require("./useSubscribeToChanges"));
/**
 * @returns the most recent workout sample.
 */
function useWorkoutById(uuid, options) {
    const [workout, setWorkout] = (0, react_1.useState)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const optionsRef = (0, react_1.useRef)(options);
    (0, react_1.useEffect)(() => {
        optionsRef.current = options;
    }, [options]);
    const update = (0, react_1.useCallback)(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedWorkout = await (0, getWorkoutById_1.default)(uuid, {
                energyUnit: optionsRef.current?.energyUnit,
                distanceUnit: optionsRef.current?.distanceUnit,
            });
            setWorkout(fetchedWorkout);
        }
        catch (err) {
            setError(err instanceof Error
                ? err
                : new Error('Unknown error fetching workout by ID'));
        }
        finally {
            setIsLoading(false);
        }
    }, [uuid]);
    (0, react_1.useEffect)(() => {
        void update();
    }, [update]);
    (0, useSubscribeToChanges_1.default)('HKWorkoutTypeIdentifier', update);
    return { workout, isLoading, error };
}
exports.default = useWorkoutById;
