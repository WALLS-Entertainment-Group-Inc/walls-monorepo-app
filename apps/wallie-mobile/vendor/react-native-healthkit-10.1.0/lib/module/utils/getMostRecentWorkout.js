import { Workouts } from '../modules';
const getMostRecentWorkout = async (options) => {
    const workouts = await Workouts.queryWorkoutSamples({
        limit: 1,
        ascending: false,
        energyUnit: options?.energyUnit,
        distanceUnit: options?.distanceUnit,
    });
    return workouts[0];
};
export default getMostRecentWorkout;
