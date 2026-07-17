import useHealthkitAuthorization from './hooks/useHealthkitAuthorization';
import { useIsHealthDataAvailable } from './hooks/useIsHealthDataAvailable';
import useMostRecentCategorySample from './hooks/useMostRecentCategorySample';
import useMostRecentQuantitySample from './hooks/useMostRecentQuantitySample';
import useMostRecentWorkout from './hooks/useMostRecentWorkout';
import useSources from './hooks/useSources';
import useStatisticsForQuantity from './hooks/useStatisticsForQuantity';
import useSubscribeToChanges from './hooks/useSubscribeToChanges';
import type { QuantityTypeIdentifier } from './types/QuantityTypeIdentifier';
import getMostRecentCategorySample from './utils/getMostRecentCategorySample';
import getMostRecentQuantitySample from './utils/getMostRecentQuantitySample';
import getMostRecentWorkout from './utils/getMostRecentWorkout';
import getPreferredUnit from './utils/getPreferredUnit';
export * from './types';
declare const currentMajorVersionIOS: number;
/**
 * Quantity types that are not available before iOS 17
 */
type QuantityTypesIOS17Plus = 'HKQuantityTypeIdentifierCyclingCadence' | 'HKQuantityTypeIdentifierCyclingFunctionalThresholdPower' | 'HKQuantityTypeIdentifierCyclingPower' | 'HKQuantityTypeIdentifierCyclingSpeed' | 'HKQuantityTypeIdentifierPhysicalEffort' | 'HKQuantityTypeIdentifierTimeInDaylight';
/**
 * Available quantity types for iOS versions before iOS 17
 */
export type AvailableQuantityTypesBeforeIOS17 = Exclude<QuantityTypeIdentifier, QuantityTypesIOS17Plus>;
export { getMostRecentCategorySample, getMostRecentQuantitySample, getMostRecentWorkout, getPreferredUnit, useMostRecentCategorySample, useMostRecentQuantitySample, useMostRecentWorkout, useSubscribeToChanges, useHealthkitAuthorization, useIsHealthDataAvailable, useSources, useStatisticsForQuantity, };
/**
 * Available quantity types for iOS 17 and later (all quantity types)
 */
export type AvailableQuantityTypesIOS17Plus = QuantityTypeIdentifier;
/**
 * Get available quantity types based on iOS version
 * @param majorVersionIOS - iOS major version number (defaults to current iOS version)
 * @returns Available quantity types for the given iOS version
 */
export type AvailableQuantityTypes<T extends number = typeof currentMajorVersionIOS> = T extends 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 ? AvailableQuantityTypesIOS17Plus : AvailableQuantityTypesBeforeIOS17;
export declare const authorizationStatusFor: (type: import("./types").ObjectTypeIdentifier) => import("./types").AuthorizationStatus;
export declare const disableAllBackgroundDelivery: () => Promise<boolean>;
export declare const disableBackgroundDelivery: (typeIdentifier: import("./types").ObjectTypeIdentifier) => Promise<boolean>;
export declare const enableBackgroundDelivery: (typeIdentifier: import("./types").ObjectTypeIdentifier, updateFrequency: import("./types").UpdateFrequency) => Promise<boolean>;
export declare const getBiologicalSex: () => import("./types").BiologicalSex;
export declare const getBloodType: () => import("./types").BloodType;
export declare const getDateOfBirth: () => Date | null;
export declare const getFitzpatrickSkinType: () => import("./types").FitzpatrickSkinType;
export declare const getPreferredUnits: (identifiers: readonly QuantityTypeIdentifier[], forceUpdate?: boolean) => Promise<import("./types").IdentifierWithUnit[]>;
export declare const getRequestStatusForAuthorization: (toShare: readonly import("./types").SampleTypeIdentifierWriteable[], toRead: readonly import("./types").ObjectTypeIdentifier[]) => Promise<import("./types").AuthorizationRequestStatus>;
export declare const getWheelchairUse: () => import("./types").WheelchairUse;
export declare const isHealthDataAvailable: () => boolean;
export declare const isHealthDataAvailableAsync: () => Promise<boolean>;
export declare const queryCategorySamples: <T extends import("./types").CategoryTypeIdentifier>(identifier: T, options?: import("./types").QueryOptionsWithSortOrder) => Promise<readonly import("./types").CategorySampleTyped<T>[]>;
export declare const queryCategorySamplesWithAnchor: <T extends import("./types").CategoryTypeIdentifier>(identifier: T, options: import("./types").QueryOptionsWithAnchor) => Promise<import("./types").CategorySamplesWithAnchorResponseTyped<T>>;
export declare const queryCorrelationSamples: (typeIdentifier: import("./types").CorrelationTypeIdentifier, from: Date, to: Date) => Promise<readonly import("./types").CorrelationSample[]>;
export declare const queryHeartbeatSeriesSamples: (options?: import("./types").QueryOptionsWithSortOrder) => Promise<readonly import("./types").HeartbeatSeriesSample[]>;
export declare const queryHeartbeatSeriesSamplesWithAnchor: (options: import("./types").QueryOptionsWithAnchor) => Promise<import("./types").HeartbeatSeriesSamplesWithAnchorResponse>;
export declare const queryQuantitySamples: (identifier: QuantityTypeIdentifier, options?: import("./types").QueryOptionsWithSortOrderAndUnit) => Promise<readonly import("./types").QuantitySample[]>;
export declare const queryQuantitySamplesWithAnchor: (identifier: QuantityTypeIdentifier, options: import("./types").QueryOptionsWithAnchorAndUnit) => Promise<import("./types").QuantitySamplesWithAnchorResponse>;
export declare const queryStatisticsForQuantity: (identifier: QuantityTypeIdentifier, statistics: readonly import("./types").StatisticsOptions[], options?: import("./types").StatisticsQueryOptions) => Promise<import("./types").QueryStatisticsResponse>;
export declare const queryStatisticsCollectionForQuantity: (identifier: QuantityTypeIdentifier, statistics: readonly import("./types").StatisticsOptions[], anchorDate: string, intervalComponents: import("./types").IntervalComponents, options?: import("./types").StatisticsQueryOptions) => Promise<readonly import("./types").QueryStatisticsResponse[]>;
export declare const queryWorkoutSamples: (options: import("./types").WorkoutQueryOptions) => Promise<import("./specs/WorkoutProxy.nitro").WorkoutProxy[]>;
export declare const queryWorkoutSamplesWithAnchor: (options: import("./types").WorkoutQueryOptionsWithAnchor) => Promise<import("./types").QueryWorkoutSamplesWithAnchorResponse>;
export declare const querySources: (identifier: import("./types").SampleTypeIdentifier) => Promise<readonly import("./specs/SourceProxy.nitro").SourceProxy[]>;
export declare const requestAuthorization: (toShare: readonly import("./types").SampleTypeIdentifierWriteable[], toRead: readonly import("./types").ObjectTypeIdentifier[]) => Promise<boolean>;
export declare const deleteObjects: (objectTypeIdentifier: import("./types").ObjectTypeIdentifier, filter: import("./types").FilterForSamples) => Promise<number>;
export declare const saveCategorySample: <T extends import("./types").CategoryTypeIdentifier>(identifier: T, value: import("./types").CategoryValueForIdentifier, startDate: Date, endDate: Date, metadata: import("./types").MetadataForCategoryIdentifier<T>) => Promise<boolean>;
export declare const saveCorrelationSample: (typeIdentifier: import("./types").CorrelationTypeIdentifier, samples: import("./types").SampleForSaving[], start: Date, end: Date, metadata: import("react-native-nitro-modules").AnyMap) => Promise<boolean>;
export declare const saveQuantitySample: (identifier: QuantityTypeIdentifier, unit: string, value: number, start: Date, end: Date, metadata: import("react-native-nitro-modules").AnyMap) => Promise<boolean>;
export declare const saveWorkoutSample: (workoutActivityType: import("./types").WorkoutActivityType, quantities: readonly import("./types").QuantitySampleForSaving[], startDate: Date, endDate: Date, totals: import("./types").WorkoutTotals, metadata: import("react-native-nitro-modules").AnyMap) => Promise<import("./specs/WorkoutProxy.nitro").WorkoutProxy>;
export declare const subscribeToChanges: (typeIdentifier: import("./types").SampleTypeIdentifier, callback: (args: import("./types").OnChangeCallbackArgs) => void) => string;
export declare const startWatchApp: (workoutConfiguration: import("./types").WorkoutConfiguration) => Promise<boolean>;
export declare const isProtectedDataAvailable: () => boolean;
export declare const queryStateOfMindSamples: (options?: import("./types").QueryOptionsWithSortOrder) => Promise<readonly import("./types").StateOfMindSample[]>;
export declare const saveStateOfMindSample: (date: Date, kind: import("./types").StateOfMindKind, valence: number, labels: readonly import("./types").StateOfMindLabel[], associations: readonly import("./types").StateOfMindAssociation[], metadata?: import("react-native-nitro-modules").AnyMap) => Promise<boolean>;
export declare const isQuantityCompatibleWithUnit: (identifier: QuantityTypeIdentifier, unit: string) => boolean;
export declare const unsubscribeQueries: (queryIds: string[]) => number;
export declare const isObjectTypeAvailable: (objectTypeIdentifier: import("./types").ObjectTypeIdentifier) => boolean;
export declare const isObjectTypeAvailableAsync: (objectTypeIdentifier: import("./types").ObjectTypeIdentifier) => Promise<boolean>;
export declare const areObjectTypesAvailable: (objectTypeIdentifiers: readonly import("./types").ObjectTypeIdentifier[]) => Record<string, boolean>;
export declare const areObjectTypesAvailableAsync: (objectTypeIdentifiers: import("./types").ObjectTypeIdentifier[]) => Promise<Record<string, boolean>>;
export declare const getBiologicalSexAsync: () => Promise<import("./types").BiologicalSex>;
export declare const getBloodTypeAsync: () => Promise<import("./types").BloodType>;
export declare const getDateOfBirthAsync: () => Promise<Date | null>;
export declare const getFitzpatrickSkinTypeAsync: () => Promise<import("./types").FitzpatrickSkinType>;
export declare const getWheelchairUseAsync: () => Promise<import("./types").WheelchairUse>;
declare const _default: {
    authorizationStatusFor: (type: import("./types").ObjectTypeIdentifier) => import("./types").AuthorizationStatus;
    isObjectTypeAvailable: (objectTypeIdentifier: import("./types").ObjectTypeIdentifier) => boolean;
    isObjectTypeAvailableAsync: (objectTypeIdentifier: import("./types").ObjectTypeIdentifier) => Promise<boolean>;
    areObjectTypesAvailable: (objectTypeIdentifiers: readonly import("./types").ObjectTypeIdentifier[]) => Record<string, boolean>;
    areObjectTypesAvailableAsync: (objectTypeIdentifiers: import("./types").ObjectTypeIdentifier[]) => Promise<Record<string, boolean>>;
    isQuantityCompatibleWithUnit: (identifier: QuantityTypeIdentifier, unit: string) => boolean;
    disableAllBackgroundDelivery: () => Promise<boolean>;
    disableBackgroundDelivery: (typeIdentifier: import("./types").ObjectTypeIdentifier) => Promise<boolean>;
    enableBackgroundDelivery: (typeIdentifier: import("./types").ObjectTypeIdentifier, updateFrequency: import("./types").UpdateFrequency) => Promise<boolean>;
    getBiologicalSex: () => import("./types").BiologicalSex;
    getBloodType: () => import("./types").BloodType;
    getDateOfBirth: () => Date | null;
    getFitzpatrickSkinType: () => import("./types").FitzpatrickSkinType;
    getBiologicalSexAsync: () => Promise<import("./types").BiologicalSex>;
    getBloodTypeAsync: () => Promise<import("./types").BloodType>;
    getDateOfBirthAsync: () => Promise<Date | null>;
    getFitzpatrickSkinTypeAsync: () => Promise<import("./types").FitzpatrickSkinType>;
    getWheelchairUseAsync: () => Promise<import("./types").WheelchairUse>;
    getMostRecentCategorySample: typeof getMostRecentCategorySample;
    getMostRecentQuantitySample: typeof getMostRecentQuantitySample;
    getMostRecentWorkout: (options: Pick<import("./types").WorkoutQueryOptions, "distanceUnit" | "energyUnit">) => Promise<import("./specs/WorkoutProxy.nitro").WorkoutProxy | undefined>;
    getPreferredUnits: (identifiers: readonly QuantityTypeIdentifier[], forceUpdate?: boolean) => Promise<import("./types").IdentifierWithUnit[]>;
    getPreferredUnit: (quantityType: QuantityTypeIdentifier) => Promise<string>;
    getRequestStatusForAuthorization: (toShare: readonly import("./types").SampleTypeIdentifierWriteable[], toRead: readonly import("./types").ObjectTypeIdentifier[]) => Promise<import("./types").AuthorizationRequestStatus>;
    getWheelchairUse: () => import("./types").WheelchairUse;
    isHealthDataAvailable: () => boolean;
    isHealthDataAvailableAsync: () => Promise<boolean>;
    queryCategorySamples: <T extends import("./types").CategoryTypeIdentifier>(identifier: T, options?: import("./types").QueryOptionsWithSortOrder) => Promise<readonly import("./types").CategorySampleTyped<T>[]>;
    queryCategorySamplesWithAnchor: <T extends import("./types").CategoryTypeIdentifier>(identifier: T, options: import("./types").QueryOptionsWithAnchor) => Promise<import("./types").CategorySamplesWithAnchorResponseTyped<T>>;
    queryCorrelationSamples: (typeIdentifier: import("./types").CorrelationTypeIdentifier, from: Date, to: Date) => Promise<readonly import("./types").CorrelationSample[]>;
    queryHeartbeatSeriesSamples: (options?: import("./types").QueryOptionsWithSortOrder) => Promise<readonly import("./types").HeartbeatSeriesSample[]>;
    queryHeartbeatSeriesSamplesWithAnchor: (options: import("./types").QueryOptionsWithAnchor) => Promise<import("./types").HeartbeatSeriesSamplesWithAnchorResponse>;
    queryQuantitySamples: (identifier: QuantityTypeIdentifier, options?: import("./types").QueryOptionsWithSortOrderAndUnit) => Promise<readonly import("./types").QuantitySample[]>;
    queryQuantitySamplesWithAnchor: (identifier: QuantityTypeIdentifier, options: import("./types").QueryOptionsWithAnchorAndUnit) => Promise<import("./types").QuantitySamplesWithAnchorResponse>;
    queryStatisticsForQuantity: (identifier: QuantityTypeIdentifier, statistics: readonly import("./types").StatisticsOptions[], options?: import("./types").StatisticsQueryOptions) => Promise<import("./types").QueryStatisticsResponse>;
    queryStatisticsCollectionForQuantity: (identifier: QuantityTypeIdentifier, statistics: readonly import("./types").StatisticsOptions[], anchorDate: string, intervalComponents: import("./types").IntervalComponents, options?: import("./types").StatisticsQueryOptions) => Promise<readonly import("./types").QueryStatisticsResponse[]>;
    queryWorkoutSamples: (options: import("./types").WorkoutQueryOptions) => Promise<import("./specs/WorkoutProxy.nitro").WorkoutProxy[]>;
    queryWorkoutSamplesWithAnchor: (options: import("./types").WorkoutQueryOptionsWithAnchor) => Promise<import("./types").QueryWorkoutSamplesWithAnchorResponse>;
    querySources: (identifier: import("./types").SampleTypeIdentifier) => Promise<readonly import("./specs/SourceProxy.nitro").SourceProxy[]>;
    requestAuthorization: (toShare: readonly import("./types").SampleTypeIdentifierWriteable[], toRead: readonly import("./types").ObjectTypeIdentifier[]) => Promise<boolean>;
    deleteObjects: (objectTypeIdentifier: import("./types").ObjectTypeIdentifier, filter: import("./types").FilterForSamples) => Promise<number>;
    saveCategorySample: <T extends import("./types").CategoryTypeIdentifier>(identifier: T, value: import("./types").CategoryValueForIdentifier, startDate: Date, endDate: Date, metadata: import("./types").MetadataForCategoryIdentifier<T>) => Promise<boolean>;
    saveCorrelationSample: (typeIdentifier: import("./types").CorrelationTypeIdentifier, samples: import("./types").SampleForSaving[], start: Date, end: Date, metadata: import("react-native-nitro-modules").AnyMap) => Promise<boolean>;
    saveQuantitySample: (identifier: QuantityTypeIdentifier, unit: string, value: number, start: Date, end: Date, metadata: import("react-native-nitro-modules").AnyMap) => Promise<boolean>;
    saveWorkoutSample: (workoutActivityType: import("./types").WorkoutActivityType, quantities: readonly import("./types").QuantitySampleForSaving[], startDate: Date, endDate: Date, totals: import("./types").WorkoutTotals, metadata: import("react-native-nitro-modules").AnyMap) => Promise<import("./specs/WorkoutProxy.nitro").WorkoutProxy>;
    subscribeToChanges: (typeIdentifier: import("./types").SampleTypeIdentifier, callback: (args: import("./types").OnChangeCallbackArgs) => void) => string;
    unsubscribeQueries: (queryIds: string[]) => number;
    startWatchApp: (workoutConfiguration: import("./types").WorkoutConfiguration) => Promise<boolean>;
    isProtectedDataAvailable: () => boolean;
    queryStateOfMindSamples: (options?: import("./types").QueryOptionsWithSortOrder) => Promise<readonly import("./types").StateOfMindSample[]>;
    saveStateOfMindSample: (date: Date, kind: import("./types").StateOfMindKind, valence: number, labels: readonly import("./types").StateOfMindLabel[], associations: readonly import("./types").StateOfMindAssociation[], metadata?: import("react-native-nitro-modules").AnyMap) => Promise<boolean>;
    useMostRecentCategorySample: typeof useMostRecentCategorySample;
    useMostRecentQuantitySample: typeof useMostRecentQuantitySample;
    useMostRecentWorkout: typeof useMostRecentWorkout;
    useSubscribeToChanges: typeof useSubscribeToChanges;
    useHealthkitAuthorization: (read: readonly import("./types").ObjectTypeIdentifier[], write?: readonly import("./types").SampleTypeIdentifierWriteable[]) => readonly [import("./types").AuthorizationRequestStatus | null, () => Promise<import("./types").AuthorizationRequestStatus>];
    useIsHealthDataAvailable: () => boolean | null;
    useSources: typeof useSources;
    useStatisticsForQuantity: typeof useStatisticsForQuantity;
};
export default _default;
