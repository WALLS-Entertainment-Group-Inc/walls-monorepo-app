import { Platform } from 'react-native';
import useHealthkitAuthorization from './hooks/useHealthkitAuthorization';
import { useIsHealthDataAvailable } from './hooks/useIsHealthDataAvailable';
import useMostRecentCategorySample from './hooks/useMostRecentCategorySample';
import useMostRecentQuantitySample from './hooks/useMostRecentQuantitySample';
import useMostRecentWorkout from './hooks/useMostRecentWorkout';
import useSources from './hooks/useSources';
import useStatisticsForQuantity from './hooks/useStatisticsForQuantity';
import useSubscribeToChanges from './hooks/useSubscribeToChanges';
import { CategoryTypes, Characteristics, Core, CorrelationTypes, HeartbeatSeries, QuantityTypes, StateOfMind, Workouts, } from './modules';
import getMostRecentCategorySample from './utils/getMostRecentCategorySample';
import getMostRecentQuantitySample from './utils/getMostRecentQuantitySample';
import getMostRecentWorkout from './utils/getMostRecentWorkout';
import getPreferredUnit from './utils/getPreferredUnit';
export * from './types';
const currentMajorVersionIOS = Platform.OS === 'ios' ? Number.parseInt(Platform.Version, 10) : 0;
export { getMostRecentCategorySample, getMostRecentQuantitySample, getMostRecentWorkout, getPreferredUnit, useMostRecentCategorySample, useMostRecentQuantitySample, useMostRecentWorkout, useSubscribeToChanges, useHealthkitAuthorization, useIsHealthDataAvailable, useSources, useStatisticsForQuantity, };
// Named exports - all functions bound to their respective modules
export const authorizationStatusFor = Core.authorizationStatusFor.bind(Core);
export const disableAllBackgroundDelivery = Core.disableAllBackgroundDelivery.bind(Core);
export const disableBackgroundDelivery = Core.disableBackgroundDelivery.bind(Core);
export const enableBackgroundDelivery = Core.enableBackgroundDelivery.bind(Core);
export const getBiologicalSex = Characteristics.getBiologicalSex.bind(Characteristics);
export const getBloodType = Characteristics.getBloodType.bind(Characteristics);
export const getDateOfBirth = Characteristics.getDateOfBirth.bind(Characteristics);
export const getFitzpatrickSkinType = Characteristics.getFitzpatrickSkinType.bind(Characteristics);
export const getPreferredUnits = Core.getPreferredUnits.bind(Core);
export const getRequestStatusForAuthorization = Core.getRequestStatusForAuthorization.bind(Core);
export const getWheelchairUse = Characteristics.getWheelchairUse.bind(Characteristics);
export const isHealthDataAvailable = Core.isHealthDataAvailable.bind(Core);
export const isHealthDataAvailableAsync = Core.isHealthDataAvailableAsync.bind(Core);
export const queryCategorySamples = CategoryTypes.queryCategorySamples.bind(CategoryTypes);
export const queryCategorySamplesWithAnchor = CategoryTypes.queryCategorySamplesWithAnchor.bind(CategoryTypes);
export const queryCorrelationSamples = CorrelationTypes.queryCorrelationSamples.bind(CorrelationTypes);
export const queryHeartbeatSeriesSamples = HeartbeatSeries.queryHeartbeatSeriesSamples.bind(HeartbeatSeries);
export const queryHeartbeatSeriesSamplesWithAnchor = HeartbeatSeries.queryHeartbeatSeriesSamplesWithAnchor.bind(HeartbeatSeries);
export const queryQuantitySamples = QuantityTypes.queryQuantitySamples.bind(QuantityTypes);
export const queryQuantitySamplesWithAnchor = QuantityTypes.queryQuantitySamplesWithAnchor.bind(QuantityTypes);
export const queryStatisticsForQuantity = QuantityTypes.queryStatisticsForQuantity.bind(QuantityTypes);
export const queryStatisticsCollectionForQuantity = QuantityTypes.queryStatisticsCollectionForQuantity.bind(QuantityTypes);
export const queryWorkoutSamples = Workouts.queryWorkoutSamples.bind(Workouts);
export const queryWorkoutSamplesWithAnchor = Workouts.queryWorkoutSamplesWithAnchor.bind(Workouts);
export const querySources = Core.querySources.bind(Core);
export const requestAuthorization = Core.requestAuthorization.bind(Core);
export const deleteObjects = Core.deleteObjects.bind(Core);
export const saveCategorySample = CategoryTypes.saveCategorySample.bind(CategoryTypes);
export const saveCorrelationSample = CorrelationTypes.saveCorrelationSample.bind(CorrelationTypes);
export const saveQuantitySample = QuantityTypes.saveQuantitySample.bind(QuantityTypes);
export const saveWorkoutSample = Workouts.saveWorkoutSample.bind(Workouts);
export const subscribeToChanges = Core.subscribeToObserverQuery.bind(Core);
export const startWatchApp = Workouts.startWatchAppWithWorkoutConfiguration.bind(Workouts);
export const isProtectedDataAvailable = Core.isProtectedDataAvailable.bind(Core);
export const queryStateOfMindSamples = StateOfMind.queryStateOfMindSamples.bind(StateOfMind);
export const saveStateOfMindSample = StateOfMind.saveStateOfMindSample.bind(StateOfMind);
export const isQuantityCompatibleWithUnit = QuantityTypes.isQuantityCompatibleWithUnit.bind(QuantityTypes);
export const unsubscribeQueries = Core.unsubscribeQueries.bind(Core);
export const isObjectTypeAvailable = Core.isObjectTypeAvailable.bind(Core);
export const isObjectTypeAvailableAsync = Core.isObjectTypeAvailableAsync.bind(Core);
export const areObjectTypesAvailable = Core.areObjectTypesAvailable.bind(Core);
export const areObjectTypesAvailableAsync = Core.areObjectTypesAvailableAsync.bind(Core);
export const getBiologicalSexAsync = Characteristics.getBiologicalSexAsync.bind(Characteristics);
export const getBloodTypeAsync = Characteristics.getBloodTypeAsync.bind(Characteristics);
export const getDateOfBirthAsync = Characteristics.getDateOfBirthAsync.bind(Characteristics);
export const getFitzpatrickSkinTypeAsync = Characteristics.getFitzpatrickSkinTypeAsync.bind(Characteristics);
export const getWheelchairUseAsync = Characteristics.getWheelchairUseAsync.bind(Characteristics);
export default {
    authorizationStatusFor,
    isObjectTypeAvailable,
    isObjectTypeAvailableAsync,
    areObjectTypesAvailable,
    areObjectTypesAvailableAsync,
    isQuantityCompatibleWithUnit,
    disableAllBackgroundDelivery,
    disableBackgroundDelivery,
    enableBackgroundDelivery,
    getBiologicalSex,
    getBloodType,
    getDateOfBirth,
    getFitzpatrickSkinType,
    getBiologicalSexAsync,
    getBloodTypeAsync,
    getDateOfBirthAsync,
    getFitzpatrickSkinTypeAsync,
    getWheelchairUseAsync,
    getMostRecentCategorySample,
    getMostRecentQuantitySample,
    getMostRecentWorkout,
    getPreferredUnits,
    getPreferredUnit,
    getRequestStatusForAuthorization,
    getWheelchairUse,
    isHealthDataAvailable,
    isHealthDataAvailableAsync,
    queryCategorySamples,
    queryCategorySamplesWithAnchor,
    queryCorrelationSamples,
    queryHeartbeatSeriesSamples,
    queryHeartbeatSeriesSamplesWithAnchor,
    queryQuantitySamples,
    queryQuantitySamplesWithAnchor,
    queryStatisticsForQuantity,
    queryStatisticsCollectionForQuantity,
    queryWorkoutSamples,
    queryWorkoutSamplesWithAnchor,
    querySources,
    requestAuthorization,
    deleteObjects,
    saveCategorySample,
    saveCorrelationSample,
    saveQuantitySample,
    saveWorkoutSample,
    subscribeToChanges,
    unsubscribeQueries,
    startWatchApp,
    isProtectedDataAvailable,
    queryStateOfMindSamples,
    saveStateOfMindSample,
    // hooks
    useMostRecentCategorySample,
    useMostRecentQuantitySample,
    useMostRecentWorkout,
    useSubscribeToChanges,
    useHealthkitAuthorization,
    useIsHealthDataAvailable,
    useSources,
    useStatisticsForQuantity,
};
