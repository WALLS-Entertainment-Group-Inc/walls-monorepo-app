import { Workouts } from '../modules';
const getWorkoutById = async (uuid, options) => {
    const workouts = await Workouts.queryWorkoutSamples({
        limit: 1,
        filter: {
            uuid: uuid,
        },
        energyUnit: options?.energyUnit,
        distanceUnit: options?.distanceUnit,
    });
    return workouts[0];
};
export default getWorkoutById;
