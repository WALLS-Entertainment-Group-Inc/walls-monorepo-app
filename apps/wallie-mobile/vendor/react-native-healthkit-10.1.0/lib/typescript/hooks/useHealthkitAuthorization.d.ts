import type { AuthorizationRequestStatus } from '../types/Auth';
import type { ObjectTypeIdentifier, SampleTypeIdentifierWriteable } from '../types/Shared';
/**
 * @description Hook to retrieve the current authorization status for the given types, and request authorization if needed.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614152-requestauthorization Apple Docs - requestAuthorization}
 * @see {@link https://developer.apple.com/documentation/healthkit/authorizing_access_to_health_data Apple Docs - Authorizing access to health data}
 */
export declare const useHealthkitAuthorization: (read: readonly ObjectTypeIdentifier[], write?: readonly SampleTypeIdentifierWriteable[]) => readonly [AuthorizationRequestStatus | null, () => Promise<AuthorizationRequestStatus>];
export default useHealthkitAuthorization;
