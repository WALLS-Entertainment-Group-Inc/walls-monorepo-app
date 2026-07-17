"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modules_1 = require("../modules");
const getMostRecentWorkout = async (options) => {
    const workouts = await modules_1.Workouts.queryWorkoutSamples({
        limit: 1,
        ascending: false,
        energyUnit: options?.energyUnit,
        distanceUnit: options?.distanceUnit,
    });
    return workouts[0];
};
exports.default = getMostRecentWorkout;
