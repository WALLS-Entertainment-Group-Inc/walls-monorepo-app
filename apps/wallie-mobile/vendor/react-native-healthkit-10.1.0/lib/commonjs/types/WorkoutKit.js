"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutSessionLocationType = void 0;
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkworkoutsessionlocationtype Apple Docs }
 */
var WorkoutSessionLocationType;
(function (WorkoutSessionLocationType) {
    WorkoutSessionLocationType[WorkoutSessionLocationType["unknown"] = 1] = "unknown";
    WorkoutSessionLocationType[WorkoutSessionLocationType["indoor"] = 2] = "indoor";
    WorkoutSessionLocationType[WorkoutSessionLocationType["outdoor"] = 3] = "outdoor";
})(WorkoutSessionLocationType || (exports.WorkoutSessionLocationType = WorkoutSessionLocationType = {}));
