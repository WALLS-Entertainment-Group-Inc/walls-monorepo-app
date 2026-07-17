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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBiologicalSexAsync = exports.useStatisticsForQuantity = exports.useSources = exports.useIsHealthDataAvailable = exports.useHealthkitAuthorization = exports.useSubscribeToChanges = exports.useMostRecentWorkout = exports.useMostRecentQuantitySample = exports.getPreferredUnit = exports.getMostRecentWorkout = exports.getMostRecentQuantitySample = exports.saveStateOfMindSample = exports.queryStateOfMindSamples = exports.startWatchApp = exports.saveWorkoutSample = exports.queryWorkoutSamplesWithAnchor = exports.queryWorkoutSamples = exports.queryHeartbeatSeriesSamplesWithAnchor = exports.queryHeartbeatSeriesSamples = exports.saveCorrelationSample = exports.queryCorrelationSamples = exports.saveCategorySample = exports.isQuantityCompatibleWithUnit = exports.saveQuantitySample = exports.queryStatisticsCollectionForQuantity = exports.queryStatisticsForQuantity = exports.queryQuantitySamplesWithAnchor = exports.queryQuantitySamples = exports.getWheelchairUse = exports.getFitzpatrickSkinType = exports.getDateOfBirth = exports.getBloodType = exports.getBiologicalSex = exports.areObjectTypesAvailableAsync = exports.areObjectTypesAvailable = exports.isObjectTypeAvailableAsync = exports.isObjectTypeAvailable = exports.isProtectedDataAvailable = exports.subscribeToChanges = exports.deleteObjects = exports.requestAuthorization = exports.querySources = exports.isHealthDataAvailableAsync = exports.isHealthDataAvailable = exports.getRequestStatusForAuthorization = exports.getPreferredUnits = exports.enableBackgroundDelivery = exports.disableBackgroundDelivery = exports.disableAllBackgroundDelivery = exports.authorizationStatusFor = void 0;
exports.unsubscribeQueries = exports.getWheelchairUseAsync = exports.getFitzpatrickSkinTypeAsync = exports.getDateOfBirthAsync = exports.getBloodTypeAsync = void 0;
exports.queryCategorySamples = queryCategorySamples;
exports.queryCategorySamplesWithAnchor = queryCategorySamplesWithAnchor;
exports.getMostRecentCategorySample = getMostRecentCategorySample;
exports.useMostRecentCategorySample = useMostRecentCategorySample;
const react_native_1 = require("react-native");
const Auth_1 = require("./types/Auth");
const Characteristics_1 = require("./types/Characteristics");
__exportStar(require("./types"), exports);
const notAvailableError = `[@kingstinct/react-native-healthkit] Platform "${react_native_1.Platform.OS}" not supported. HealthKit is only available on iOS.`;
let hasWarned = false;
// @ts-ignore
function UnavailableFnFromModule(_fn, defaultValue) {
    // @ts-ignore
    return () => {
        if (react_native_1.Platform.OS !== 'ios' && !hasWarned) {
            console.warn(notAvailableError);
            hasWarned = true;
        }
        return defaultValue;
    };
}
// --- Mock Implementations for exported functions ---
// CoreModule functions
exports.authorizationStatusFor = UnavailableFnFromModule('authorizationStatusFor', Auth_1.AuthorizationStatus.notDetermined);
exports.disableAllBackgroundDelivery = UnavailableFnFromModule('disableAllBackgroundDelivery', Promise.resolve(false));
exports.disableBackgroundDelivery = UnavailableFnFromModule('disableBackgroundDelivery', Promise.resolve(false));
exports.enableBackgroundDelivery = UnavailableFnFromModule('enableBackgroundDelivery', Promise.resolve(false));
exports.getPreferredUnits = UnavailableFnFromModule('getPreferredUnits', Promise.resolve([]));
exports.getRequestStatusForAuthorization = UnavailableFnFromModule('getRequestStatusForAuthorization', Promise.resolve(Auth_1.AuthorizationRequestStatus.unknown));
exports.isHealthDataAvailable = UnavailableFnFromModule('isHealthDataAvailable', false); // Original was synchronous
exports.isHealthDataAvailableAsync = UnavailableFnFromModule('isHealthDataAvailableAsync', Promise.resolve(false)); // Added for consistency if needed
exports.querySources = UnavailableFnFromModule('querySources', Promise.resolve([]));
exports.requestAuthorization = UnavailableFnFromModule('requestAuthorization', Promise.resolve(false));
exports.deleteObjects = UnavailableFnFromModule('deleteObjects', Promise.resolve(0));
exports.subscribeToChanges = UnavailableFnFromModule('subscribeToChanges', 'dummy-query-uuid'); // Mocking the observer query UUID
exports.isProtectedDataAvailable = UnavailableFnFromModule('isProtectedDataAvailable', false);
exports.isObjectTypeAvailable = UnavailableFnFromModule('isObjectTypeAvailable', false);
exports.isObjectTypeAvailableAsync = UnavailableFnFromModule('isObjectTypeAvailableAsync', Promise.resolve(false));
exports.areObjectTypesAvailable = UnavailableFnFromModule('areObjectTypesAvailable', {});
exports.areObjectTypesAvailableAsync = UnavailableFnFromModule('areObjectTypesAvailableAsync', Promise.resolve({}));
// CharacteristicTypeModule functions
exports.getBiologicalSex = UnavailableFnFromModule('getBiologicalSex', Characteristics_1.BiologicalSex.notSet);
exports.getBloodType = UnavailableFnFromModule('getBloodType', Characteristics_1.BloodType.notSet);
exports.getDateOfBirth = UnavailableFnFromModule('getDateOfBirth', new Date(0)); // Assuming string for date
exports.getFitzpatrickSkinType = UnavailableFnFromModule('getFitzpatrickSkinType', Characteristics_1.FitzpatrickSkinType.notSet);
exports.getWheelchairUse = UnavailableFnFromModule('getWheelchairUse', Characteristics_1.WheelchairUse.notSet);
// QuantityTypeModule functions
exports.queryQuantitySamples = UnavailableFnFromModule('queryQuantitySamples', Promise.resolve([]));
exports.queryQuantitySamplesWithAnchor = UnavailableFnFromModule('queryQuantitySamplesWithAnchor', Promise.resolve({
    samples: [],
    deletedSamples: [],
    newAnchor: '',
}));
exports.queryStatisticsForQuantity = UnavailableFnFromModule('queryStatisticsForQuantity', Promise.resolve({}));
exports.queryStatisticsCollectionForQuantity = UnavailableFnFromModule('queryStatisticsCollectionForQuantity', Promise.resolve([]));
exports.saveQuantitySample = UnavailableFnFromModule('saveQuantitySample', Promise.resolve(false));
exports.isQuantityCompatibleWithUnit = UnavailableFnFromModule('isQuantityCompatibleWithUnit', false);
// CategoryTypeModule functions
function queryCategorySamples(_categoryTypeIdentifier, _options) {
    if (react_native_1.Platform.OS !== 'ios' && !hasWarned) {
        console.warn(notAvailableError);
        hasWarned = true;
    }
    return Promise.resolve([]);
}
function queryCategorySamplesWithAnchor(_categoryTypeIdentifier, _options) {
    if (react_native_1.Platform.OS !== 'ios' && !hasWarned) {
        console.warn(notAvailableError);
        hasWarned = true;
    }
    return Promise.resolve({
        samples: [],
        deletedSamples: [],
        newAnchor: '',
    });
}
exports.saveCategorySample = UnavailableFnFromModule('saveCategorySample', Promise.resolve(false));
// CorrelationTypeModule functions
exports.queryCorrelationSamples = UnavailableFnFromModule('queryCorrelationSamples', Promise.resolve([]));
exports.saveCorrelationSample = UnavailableFnFromModule('saveCorrelationSample', Promise.resolve(false));
// HeartbeatSeriesModule functions
exports.queryHeartbeatSeriesSamples = UnavailableFnFromModule('queryHeartbeatSeriesSamples', Promise.resolve([]));
exports.queryHeartbeatSeriesSamplesWithAnchor = UnavailableFnFromModule('queryHeartbeatSeriesSamplesWithAnchor', Promise.resolve({
    samples: [],
    deletedSamples: [],
    newAnchor: '',
}));
// WorkoutsModule functions
exports.queryWorkoutSamples = UnavailableFnFromModule('queryWorkoutSamples', Promise.resolve([]));
exports.queryWorkoutSamplesWithAnchor = UnavailableFnFromModule('queryWorkoutSamplesWithAnchor', Promise.resolve({
    workouts: [],
    deletedSamples: [],
    newAnchor: '',
}));
exports.saveWorkoutSample = UnavailableFnFromModule('saveWorkoutSample', 
// biome-ignore lint/suspicious/noExplicitAny: it works
Promise.resolve(undefined));
exports.startWatchApp = UnavailableFnFromModule('startWatchApp', Promise.resolve(false));
// StateOfMindModule functions
exports.queryStateOfMindSamples = UnavailableFnFromModule('queryStateOfMindSamples', Promise.resolve([]));
exports.saveStateOfMindSample = UnavailableFnFromModule('saveStateOfMindSample', Promise.resolve(false));
// Utility functions (from original export list)
function getMostRecentCategorySample(_identifier) {
    if (react_native_1.Platform.OS !== 'ios' && !hasWarned) {
        console.warn(notAvailableError);
        hasWarned = true;
    }
    return Promise.resolve(undefined);
}
exports.getMostRecentQuantitySample = UnavailableFnFromModule('getMostRecentQuantitySample', 
// biome-ignore lint/suspicious/noExplicitAny: it works
Promise.resolve(undefined));
exports.getMostRecentWorkout = UnavailableFnFromModule('getMostRecentWorkout', 
// biome-ignore lint/suspicious/noExplicitAny: it works
Promise.resolve(undefined));
exports.getPreferredUnit = UnavailableFnFromModule('getPreferredUnit', Promise.resolve('count')); // Defaulting to 'count'
// Hooks (from original export list)
function useMostRecentCategorySample(_categoryTypeIdentifier) {
    if (react_native_1.Platform.OS !== 'ios' && !hasWarned) {
        console.warn(notAvailableError);
        hasWarned = true;
    }
    return undefined;
}
exports.useMostRecentQuantitySample = UnavailableFnFromModule('useMostRecentQuantitySample', undefined);
exports.useMostRecentWorkout = UnavailableFnFromModule('useMostRecentWorkout', undefined);
exports.useSubscribeToChanges = UnavailableFnFromModule('useSubscribeToChanges', undefined); // Mocking callback structure
exports.useHealthkitAuthorization = UnavailableFnFromModule('useHealthkitAuthorization', [
    Auth_1.AuthorizationRequestStatus.unknown,
    () => Promise.resolve(Auth_1.AuthorizationRequestStatus.unknown),
]);
exports.useIsHealthDataAvailable = UnavailableFnFromModule('useIsHealthDataAvailable', false);
exports.useSources = UnavailableFnFromModule('useSources', null);
exports.useStatisticsForQuantity = UnavailableFnFromModule('useStatisticsForQuantity', null);
exports.getBiologicalSexAsync = UnavailableFnFromModule('getBiologicalSexAsync', Promise.resolve(Characteristics_1.BiologicalSex.notSet));
exports.getBloodTypeAsync = UnavailableFnFromModule('getBloodTypeAsync', Promise.resolve(Characteristics_1.BloodType.notSet));
exports.getDateOfBirthAsync = UnavailableFnFromModule('getDateOfBirthAsync', Promise.resolve(new Date(0))); // Assuming string for date
exports.getFitzpatrickSkinTypeAsync = UnavailableFnFromModule('getFitzpatrickSkinTypeAsync', Promise.resolve(Characteristics_1.FitzpatrickSkinType.notSet));
exports.getWheelchairUseAsync = UnavailableFnFromModule('getWheelchairUseAsync', Promise.resolve(Characteristics_1.WheelchairUse.notSet));
exports.unsubscribeQueries = UnavailableFnFromModule('unsubscribeQueries', 0);
// --- Default Export ---
// This attempts to match the structure of the default export from index.ios.ts
const HealthkitModule = {
    // All named exports are also part of the default export object
    authorizationStatusFor: exports.authorizationStatusFor,
    isObjectTypeAvailable: exports.isObjectTypeAvailable,
    unsubscribeQueries: exports.unsubscribeQueries,
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
    getMostRecentCategorySample,
    getMostRecentQuantitySample: exports.getMostRecentQuantitySample,
    getMostRecentWorkout: exports.getMostRecentWorkout,
    getPreferredUnits: exports.getPreferredUnits,
    getPreferredUnit: exports.getPreferredUnit,
    getRequestStatusForAuthorization: exports.getRequestStatusForAuthorization,
    getWheelchairUse: exports.getWheelchairUse,
    isHealthDataAvailable: exports.isHealthDataAvailable,
    isHealthDataAvailableAsync: exports.isHealthDataAvailableAsync,
    queryCategorySamples,
    queryCategorySamplesWithAnchor,
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
    startWatchApp: exports.startWatchApp,
    isProtectedDataAvailable: exports.isProtectedDataAvailable,
    queryStateOfMindSamples: exports.queryStateOfMindSamples,
    saveStateOfMindSample: exports.saveStateOfMindSample,
    // Hooks
    useMostRecentCategorySample,
    useMostRecentQuantitySample: exports.useMostRecentQuantitySample,
    useMostRecentWorkout: exports.useMostRecentWorkout,
    useSubscribeToChanges: exports.useSubscribeToChanges,
    useHealthkitAuthorization: exports.useHealthkitAuthorization,
    useIsHealthDataAvailable: exports.useIsHealthDataAvailable,
    useSources: exports.useSources,
    useStatisticsForQuantity: exports.useStatisticsForQuantity,
    getBiologicalSexAsync: exports.getBiologicalSexAsync,
    getBloodTypeAsync: exports.getBloodTypeAsync,
    getDateOfBirthAsync: exports.getDateOfBirthAsync,
    getFitzpatrickSkinTypeAsync: exports.getFitzpatrickSkinTypeAsync,
    getWheelchairUseAsync: exports.getWheelchairUseAsync,
};
exports.default = {
    ...HealthkitModule,
    default: HealthkitModule,
};
