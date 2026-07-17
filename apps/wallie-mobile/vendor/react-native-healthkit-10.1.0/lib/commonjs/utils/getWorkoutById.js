"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modules_1 = require("../modules");
const getWorkoutById = async (uuid, options) => {
    const workouts = await modules_1.Workouts.queryWorkoutSamples({
        limit: 1,
        filter: {
            uuid: uuid,
        },
        energyUnit: options?.energyUnit,
        distanceUnit: options?.distanceUnit,
    });
    return workouts[0];
};
exports.default = getWorkoutById;
