/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutsessionlocationtype Apple Docs }
 */
export var WorkoutSessionLocationType;
(function (WorkoutSessionLocationType) {
    WorkoutSessionLocationType[WorkoutSessionLocationType["unknown"] = 1] = "unknown";
    WorkoutSessionLocationType[WorkoutSessionLocationType["indoor"] = 2] = "indoor";
    WorkoutSessionLocationType[WorkoutSessionLocationType["outdoor"] = 3] = "outdoor";
})(WorkoutSessionLocationType || (WorkoutSessionLocationType = {}));
