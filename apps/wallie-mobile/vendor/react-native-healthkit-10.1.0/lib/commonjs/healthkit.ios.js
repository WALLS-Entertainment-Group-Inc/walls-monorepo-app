"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsubscribeQueries = exports.isQuantityCompatibleWithUnit = exports.saveStateOfMindSample = exports.queryStateOfMindSamples = exports.isProtectedDataAvailable = exports.startWatchApp = exports.subscribeToChanges = exports.saveWorkoutSample = exports.saveQuantitySample = exports.saveCorrelationSample = exports.saveCategorySample = exports.deleteObjects = exports.requestAuthorization = exports.querySources = exports.queryWorkoutSamplesWithAnchor = exports.queryWorkoutSamples = exports.queryStatisticsCollectionForQuantity = exports.queryStatisticsForQuantity = exports.queryQuantitySamplesWithAnchor = exports.queryQuantitySamples = exports.queryHeartbeatSeriesSamplesWithAnchor = exports.queryHeartbeatSeriesSamples = exports.queryCorrelationSamples = exports.queryCategorySamplesWithAnchor = exports.queryCategorySamples = exports.isHealthDataAvailableAsync = exports.isHealthDataAvailable = exports.getWheelchairUse = exports.getRequestStatusForAuthorization = exports.getPreferredUnits = exports.getFitzpatrickSkinType = exports.getDateOfBirth = exports.getBloodType = exports.getBiologicalSex = exports.enableBackgroundDelivery = exports.disableBackgroundDelivery = exports.disableAllBackgroundDelivery = exports.authorizationStatusFor = exports.useStatisticsForQuantity = exports.useSources = exports.useIsHealthDataAvailable = exports.useHealthkitAuthorization = exports.useSubscribeToChanges = exports.useMostRecentWorkout = exports.useMostRecentQuantitySample = exports.useMostRecentCategorySample = exports.getPreferredUnit = exports.getMostRecentWorkout = exports.getMostRecentQuantitySample = exports.getMostRecentCategorySample = void 0;
exports.getWheelchairUseAsync = exports.getFitzpatrickSkinTypeAsync = exports.getDateOfBirthAsync = exports.getBloodTypeAsync = exports.getBiologicalSexAsync = exports.areObjectTypesAvailableAsync = exports.areObjectTypesAvailable = exports.isObjectTypeAvailableAsync = exports.isObjectTypeAvailable = void 0;
const react_native_1 = require("react-native");
const useHealthkitAuthorization_1 = __importDefault(require("./hooks/useHealthkitAuthorization"));
exports.useHealthkitAuthorization = useHealthkitAuthorization_1.default;
const useIsHealthDataAvailable_1 = require("./hooks/useIsHealthDataAvailable");
Object.defineProperty(exports, "useIsHealthDataAvailable", { enumerable: true, get: function () { return useIsHealthDataAvailable_1.useIsHealthDataAvailable; } });
const useMostRecentCategorySample_1 = __importDefault(require("./hooks/useMostRecentCategorySample"));
exports.useMostRecentCategorySample = useMostRecentCategorySample_1.default;
const useMostRecentQuantitySample_1 = __importDefault(require("./hooks/useMostRecentQuantitySample"));
exports.useMostRecentQuantitySample = useMostRecentQuantitySample_1.default;
const useMostRecentWorkout_1 = __importDefault(require("./hooks/useMostRecentWorkout"));
exports.useMostRecentWorkout = useMostRecentWorkout_1.default;
const useSources_1 = __importDefault(require("./hooks/useSources"));
exports.useSources = useSources_1.default;
const useStatisticsForQuantity_1 = __importDefault(require("./hooks/useStatisticsForQuantity"));
exports.useStatisticsForQuantity = useStatisticsForQuantity_1.default;
const useSubscribeToChanges_1 = __importDefault(require("./hooks/useSubscribeToChanges"));
exports.useSubscribeToChanges = useSubscribeToChanges_1.default;
const modules_1 = require("./modules");
const getMostRecentCategorySample_1 = __importDefault(require("./utils/getMostRecentCategorySample"));
exports.getMostRecentCategorySample = getMostRecentCategorySample_1.default;
const getMostRecentQuantitySample_1 = __importDefault(require("./utils/getMostRecentQuantitySample"));
exports.getMostRecentQuantitySample = getMostRecentQuantitySample_1.default;
const getMostRecentWorkout_1 = __importDefault(require("./utils/getMostRecentWorkout"));
exports.getMostRecentWorkout = getMostRecentWorkout_1.default;
const getPreferredUnit_1 = __importDefault(require("./utils/getPreferredUnit"));
exports.getPreferredUnit = getPreferredUnit_1.default;
__exportStar(require("./types"), exports);
const currentMajorVersionIOS = react_native_1.Platform.OS === 'ios' ? Number.parseInt(react_native_1.Platform.Version, 10) : 0;
// Named exports - all functions bound to their respective modules
exports.authorizationStatusFor = modules_1.Core.authorizationStatusFor.bind(modules_1.Core);
exports.disableAllBackgroundDelivery = modules_1.Core.disableAllBackgroundDelivery.bind(modules_1.Core);
exports.disableBackgroundDelivery = modules_1.Core.disableBackgroundDelivery.bind(modules_1.Core);
exports.enableBackgroundDelivery = modules_1.Core.enableBackgroundDelivery.bind(modules_1.Core);
exports.getBiologicalSex = modules_1.Characteristics.getBiologicalSex.bind(modules_1.Characteristics);
exports.getBloodType = modules_1.Characteristics.getBloodType.bind(modules_1.Characteristics);
exports.getDateOfBirth = modules_1.Characteristics.getDateOfBirth.bind(modules_1.Characteristics);
exports.getFitzpatrickSkinType = modules_1.Characteristics.getFitzpatrickSkinType.bind(modules_1.Characteristics);
exports.getPreferredUnits = modules_1.Core.getPreferredUnits.bind(modules_1.Core);
exports.getRequestStatusForAuthorization = modules_1.Core.getRequestStatusForAuthorization.bind(modules_1.Core);
exports.getWheelchairUse = modules_1.Characteristics.getWheelchairUse.bind(modules_1.Characteristics);
exports.isHealthDataAvailable = modules_1.Core.isHealthDataAvailable.bind(modules_1.Core);
exports.isHealthDataAvailableAsync = modules_1.Core.isHealthDataAvailableAsync.bind(modules_1.Core);
exports.queryCategorySamples = modules_1.CategoryTypes.queryCategorySamples.bind(modules_1.CategoryTypes);
exports.queryCategorySamplesWithAnchor = modules_1.CategoryTypes.queryCategorySamplesWithAnchor.bind(modules_1.CategoryTypes);
exports.queryCorrelationSamples = modules_1.CorrelationTypes.queryCorrelationSamples.bind(modules_1.CorrelationTypes);
exports.queryHeartbeatSeriesSamples = modules_1.HeartbeatSeries.queryHeartbeatSeriesSamples.bind(modules_1.HeartbeatSeries);
exports.queryHeartbeatSeriesSamplesWithAnchor = modules_1.HeartbeatSeries.queryHeartbeatSeriesSamplesWithAnchor.bind(modules_1.HeartbeatSeries);
exports.queryQuantitySamples = modules_1.QuantityTypes.queryQuantitySamples.bind(modules_1.QuantityTypes);
exports.queryQuantitySamplesWithAnchor = modules_1.QuantityTypes.queryQuantitySamplesWithAnchor.bind(modules_1.QuantityTypes);
exports.queryStatisticsForQuantity = modules_1.QuantityTypes.queryStatisticsForQuantity.bind(modules_1.QuantityTypes);
exports.queryStatisticsCollectionForQuantity = modules_1.QuantityTypes.queryStatisticsCollectionForQuantity.bind(modules_1.QuantityTypes);
exports.queryWorkoutSamples = modules_1.Workouts.queryWorkoutSamples.bind(modules_1.Workouts);
exports.queryWorkoutSamplesWithAnchor = modules_1.Workouts.queryWorkoutSamplesWithAnchor.bind(modules_1.Workouts);
exports.querySources = modules_1.Core.querySources.bind(modules_1.Core);
exports.requestAuthorization = modules_1.Core.requestAuthorization.bind(modules_1.Core);
exports.deleteObjects = modules_1.Core.deleteObjects.bind(modules_1.Core);
exports.saveCategorySample = modules_1.CategoryTypes.saveCategorySample.bind(modules_1.CategoryTypes);
exports.saveCorrelationSample = modules_1.CorrelationTypes.saveCorrelationSample.bind(modules_1.CorrelationTypes);
exports.saveQuantitySample = modules_1.QuantityTypes.saveQuantitySample.bind(modules_1.QuantityTypes);
exports.saveWorkoutSample = modules_1.Workouts.saveWorkoutSample.bind(modules_1.Workouts);
exports.subscribeToChanges = modules_1.Core.subscribeToObserverQuery.bind(modules_1.Core);
exports.startWatchApp = modules_1.Workouts.startWatchAppWithWorkoutConfiguration.bind(modules_1.Workouts);
exports.isProtectedDataAvailable = modules_1.Core.isProtectedDataAvailable.bind(modules_1.Core);
exports.queryStateOfMindSamples = modules_1.StateOfMind.queryStateOfMindSamples.bind(modules_1.StateOfMind);
exports.saveStateOfMindSample = modules_1.StateOfMind.saveStateOfMindSample.bind(modules_1.StateOfMind);
exports.isQuantityCompatibleWithUnit = modules_1.QuantityTypes.isQuantityCompatibleWithUnit.bind(modules_1.QuantityTypes);
exports.unsubscribeQueries = modules_1.Core.unsubscribeQueries.bind(modules_1.Core);
exports.isObjectTypeAvailable = modules_1.Core.isObjectTypeAvailable.bind(modules_1.Core);
exports.isObjectTypeAvailableAsync = modules_1.Core.isObjectTypeAvailableAsync.bind(modules_1.Core);
exports.areObjectTypesAvailable = modules_1.Core.areObjectTypesAvailable.bind(modules_1.Core);
exports.areObjectTypesAvailableAsync = modules_1.Core.areObjectTypesAvailableAsync.bind(modules_1.Core);
exports.getBiologicalSexAsync = modules_1.Characteristics.getBiologicalSexAsync.bind(modules_1.Characteristics);
exports.getBloodTypeAsync = modules_1.Characteristics.getBloodTypeAsync.bind(modules_1.Characteristics);
exports.getDateOfBirthAsync = modules_1.Characteristics.getDateOfBirthAsync.bind(modules_1.Characteristics);
exports.getFitzpatrickSkinTypeAsync = modules_1.Characteristics.getFitzpatrickSkinTypeAsync.bind(modules_1.Characteristics);
exports.getWheelchairUseAsync = modules_1.Characteristics.getWheelchairUseAsync.bind(modules_1.Characteristics);
exports.default = {
    authorizationStatusFor: exports.authorizationStatusFor,
    isObjectTypeAvailable: exports.isObjectTypeAvailable,
    isObjectTypeAvailableAsync: exports.isObjectTypeAvailableAsync,
    areObjectTypesAvailable: exports.areObjectTypesAvailable,
    areObjectTypesAvailableAsync: exports.areObjectTypesAvailableAsync,
    isQuantityCompatibleWithUnit: exports.isQuantityCompatibleWithUnit,
    disableAllBackgroundDelivery: exports.disableAllBackgroundDelivery,
    disableBackgroundDelivery: exports.disableBackgroundDelivery,
    enableBackgroundDelivery: exports.enableBackgroundDelivery,
    getBiologicalSex: exports.getBiologicalSex,
    getBloodType: exports.getBloodType,
    getDateOfBirth: exports.getDateOfBirth,
    getFitzpatrickSkinType: exports.getFitzpatrickSkinType,
    getBiologicalSexAsync: exports.getBiologicalSexAsync,
    getBloodTypeAsync: exports.getBloodTypeAsync,
    getDateOfBirthAsync: exports.getDateOfBirthAsync,
    getFitzpatrickSkinTypeAsync: exports.getFitzpatrickSkinTypeAsync,
    getWheelchairUseAsync: exports.getWheelchairUseAsync,
    getMostRecentCategorySample: getMostRecentCategorySample_1.default,
    getMostRecentQuantitySample: getMostRecentQuantitySample_1.default,
    getMostRecentWorkout: getMostRecentWorkout_1.default,
    getPreferredUnits: exports.getPreferredUnits,
    getPreferredUnit: getPreferredUnit_1.default,
    getRequestStatusForAuthorization: exports.getRequestStatusForAuthorization,
    getWheelchairUse: exports.getWheelchairUse,
    isHealthDataAvailable: exports.isHealthDataAvailable,
    isHealthDataAvailableAsync: exports.isHealthDataAvailableAsync,
    queryCategorySamples: exports.queryCategorySamples,
    queryCategorySamplesWithAnchor: exports.queryCategorySamplesWithAnchor,
    queryCorrelationSamples: exports.queryCorrelationSamples,
    queryHeartbeatSeriesSamples: exports.queryHeartbeatSeriesSamples,
    queryHeartbeatSeriesSamplesWithAnchor: exports.queryHeartbeatSeriesSamplesWithAnchor,
    queryQuantitySamples: exports.queryQuantitySamples,
    queryQuantitySamplesWithAnchor: exports.queryQuantitySamplesWithAnchor,
    queryStatisticsForQuantity: exports.queryStatisticsForQuantity,
    queryStatisticsCollectionForQuantity: exports.queryStatisticsCollectionForQuantity,
    queryWorkoutSamples: exports.queryWorkoutSamples,
    queryWorkoutSamplesWithAnchor: exports.queryWorkoutSamplesWithAnchor,
    querySources: exports.querySources,
    requestAuthorization: exports.requestAuthorization,
    deleteObjects: exports.deleteObjects,
    saveCategorySample: exports.saveCategorySample,
    saveCorrelationSample: exports.saveCorrelationSample,
    saveQuantitySample: exports.saveQuantitySample,
    saveWorkoutSample: exports.saveWorkoutSample,
    subscribeToChanges: exports.subscribeToChanges,
    unsubscribeQueries: exports.unsubscribeQueries,
    startWatchApp: exports.startWatchApp,
    isProtectedDataAvailable: exports.isProtectedDataAvailable,
    queryStateOfMindSamples: exports.queryStateOfMindSamples,
    saveStateOfMindSample: exports.saveStateOfMindSample,
    // hooks
    useMostRecentCategorySample: useMostRecentCategorySample_1.default,
    useMostRecentQuantitySample: useMostRecentQuantitySample_1.default,
    useMostRecentWorkout: useMostRecentWorkout_1.default,
    useSubscribeToChanges: useSubscribeToChanges_1.default,
    useHealthkitAuthorization: useHealthkitAuthorization_1.default,
    useIsHealthDataAvailable: useIsHealthDataAvailable_1.useIsHealthDataAvailable,
    useSources: useSources_1.default,
    useStatisticsForQuantity: useStatisticsForQuantity_1.default,
};
