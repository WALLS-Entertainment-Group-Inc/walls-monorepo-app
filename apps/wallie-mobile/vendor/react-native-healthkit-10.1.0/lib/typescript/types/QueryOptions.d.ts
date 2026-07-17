import type { WorkoutProxy } from '../specs/WorkoutProxy.nitro';
type PredicateWithUUID = {
    readonly uuid: string;
};
type PredicateWithUUIDs = {
    readonly uuids: readonly string[];
};
type PredicateWithStartAndEnd = {
    readonly startDate?: Date;
    readonly endDate?: Date;
    readonly strictEndDate?: boolean;
    readonly strictStartDate?: boolean;
};
type PredicateWithMetadataOperator = 'equalTo' | 'notEqualTo' | 'greaterThan' | 'lessThan';
type PredicateWithMetadataValue = string | number | Date | boolean;
type PredicateWithMetadataKey = {
    readonly withMetadataKey: string;
    readonly operatorType?: PredicateWithMetadataOperator;
    readonly value?: PredicateWithMetadataValue;
};
export type FilterForSamplesAnd = {
    readonly AND: PredicateForSamples[];
};
export type FilterForSamplesOr = {
    readonly OR: PredicateForSamples[];
};
export type PredicateFromWorkout = {
    readonly workout: WorkoutProxy;
};
type ComputeRaw<A> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
type AllKeys<U> = U extends any ? keyof U : never;
type _Strict<U, UAll extends U = U> = U extends any ? ComputeRaw<U & {
    [K in Exclude<AllKeys<UAll>, keyof U>]?: never;
}> : never;
export type StrictUnion<U extends object> = _Strict<U>;
export type FilterForSamples = PredicateForSamples | FilterForSamplesAnd | FilterForSamplesOr;
export type PredicateForSamples = PredicateWithUUID | PredicateWithUUIDs | PredicateWithMetadataKey | PredicateWithStartAndEnd | PredicateFromWorkout;
/**
 * Generic options for querying.
 */
export interface GenericQueryOptions {
    filter?: FilterForSamples;
    readonly limit?: number;
}
export interface QueryOptionsWithAnchor extends GenericQueryOptions {
    readonly anchor?: string;
}
export interface QueryOptionsWithSortOrder extends GenericQueryOptions {
    readonly ascending?: boolean;
}
export interface QueryOptionsWithSortOrderAndUnit extends QueryOptionsWithSortOrder {
    readonly unit?: string;
}
export interface QueryOptionsWithAnchorAndUnit extends QueryOptionsWithAnchor {
    readonly unit?: string;
}
export {};
