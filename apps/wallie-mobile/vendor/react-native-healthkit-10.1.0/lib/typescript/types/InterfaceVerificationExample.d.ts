/**
 * Example usage of the InterfaceVerification utility
 *
 * This file demonstrates how to use the reusable interface verification utility
 * to ensure that typed and untyped versions of interfaces stay in sync.
 */
import type { HybridObject } from 'react-native-nitro-modules';
export interface ExampleModule extends HybridObject<{
    ios: 'swift';
}> {
    getData(id: string): Promise<string>;
    saveData(id: string, data: string): Promise<boolean>;
    deleteData(id: string): Promise<void>;
}
export interface ExampleModuleTyped {
    getData<T extends string>(id: T): Promise<string>;
    saveData<T extends string>(id: T, data: string): Promise<boolean>;
    deleteData<T extends string>(id: T): Promise<void>;
}
export interface ConfigModule extends HybridObject<{
    ios: 'swift';
}> {
    getConfig(key: string, defaultValue?: string): Promise<string>;
    setConfig(key: string, value: string, persistent?: boolean): Promise<void>;
}
export interface ConfigModuleTyped {
    getConfig<T extends string>(key: T, defaultValue?: string): Promise<string>;
    setConfig<T extends string>(key: T, value: string, persistent?: boolean): Promise<void>;
}
export interface BadModule extends HybridObject<{
    ios: 'swift';
}> {
    method1(): void;
    method2(param: string): void;
    extraMethod(): void;
}
export interface BadModuleTyped {
    method1(): void;
    method2(param: string): void;
}
/**
 * Usage Instructions:
 *
 * 1. Import the InterfaceAssertion type from InterfaceVerification
 * 2. Create your base interface (extending HybridObject)
 * 3. Create your typed interface (with generics)
 * 4. Add a verification line:
 *    const _verification: InterfaceAssertion<BaseInterface, TypedInterface, keyof HybridObject> = true;
 *
 * The verification will:
 * - Check that both interfaces have the same method names
 * - Check that corresponding methods have the same number of parameters
 * - Show descriptive TypeScript errors if there are mismatches
 *
 * Error Types:
 * - "Interface mismatch detected" - method names don't match
 * - "Parameter count mismatch detected" - parameter counts don't match
 */
