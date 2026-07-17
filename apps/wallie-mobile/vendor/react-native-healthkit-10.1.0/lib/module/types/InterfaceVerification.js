/**
 * TypeScript utility types for verifying that two interfaces have matching method signatures.
 *
 * This is particularly useful for ensuring that typed and untyped versions of interfaces
 * stay in sync when one has generics and the other doesn't.
 *
 * @example
 * ```typescript
 * import type { InterfaceAssertion } from "./InterfaceVerification";
 *
 * interface BaseModule extends HybridObject<{ ios: "swift" }> {
 *   getData(id: string): Promise<string>;
 * }
 *
 * interface BaseModuleTyped {
 *   getData<T extends string>(id: T): Promise<string>;
 * }
 *
 * // This will cause a TypeScript error if the interfaces don't match
 * const _verification: InterfaceAssertion<BaseModule, BaseModuleTyped, keyof HybridObject> = true;
 * ```
 */
export {};
