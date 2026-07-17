"use strict";
/**
 * Example usage of the InterfaceVerification utility
 *
 * This file demonstrates how to use the reusable interface verification utility
 * to ensure that typed and untyped versions of interfaces stay in sync.
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Verification: This will cause a TypeScript error if the interfaces don't match
const _exampleVerification = true;
// Verification for optional parameters
const _configVerification = true;
// This will show a TypeScript error indicating the mismatch
// Uncomment to see the error:
// const _badVerification: InterfaceAssertion<BadModule, BadModuleTyped, keyof HybridObject> = true;
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
