/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkauthorizationrequeststatus Apple Docs }
 */
export var AuthorizationRequestStatus;
(function (AuthorizationRequestStatus) {
    AuthorizationRequestStatus[AuthorizationRequestStatus["unknown"] = 0] = "unknown";
    AuthorizationRequestStatus[AuthorizationRequestStatus["shouldRequest"] = 1] = "shouldRequest";
    AuthorizationRequestStatus[AuthorizationRequestStatus["unnecessary"] = 2] = "unnecessary";
})(AuthorizationRequestStatus || (AuthorizationRequestStatus = {}));
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkauthorizationstatus Apple Docs }
 */
export var AuthorizationStatus;
(function (AuthorizationStatus) {
    AuthorizationStatus[AuthorizationStatus["notDetermined"] = 0] = "notDetermined";
    AuthorizationStatus[AuthorizationStatus["sharingDenied"] = 1] = "sharingDenied";
    AuthorizationStatus[AuthorizationStatus["sharingAuthorized"] = 2] = "sharingAuthorized";
})(AuthorizationStatus || (AuthorizationStatus = {}));
