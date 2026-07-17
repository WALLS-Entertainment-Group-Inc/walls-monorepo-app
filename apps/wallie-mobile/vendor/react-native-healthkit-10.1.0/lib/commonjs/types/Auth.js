"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationStatus = exports.AuthorizationRequestStatus = void 0;
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkauthorizationrequeststatus Apple Docs }
 */
var AuthorizationRequestStatus;
(function (AuthorizationRequestStatus) {
    AuthorizationRequestStatus[AuthorizationRequestStatus["unknown"] = 0] = "unknown";
    AuthorizationRequestStatus[AuthorizationRequestStatus["shouldRequest"] = 1] = "shouldRequest";
    AuthorizationRequestStatus[AuthorizationRequestStatus["unnecessary"] = 2] = "unnecessary";
})(AuthorizationRequestStatus || (exports.AuthorizationRequestStatus = AuthorizationRequestStatus = {}));
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkauthorizationstatus Apple Docs }
 */
var AuthorizationStatus;
(function (AuthorizationStatus) {
    AuthorizationStatus[AuthorizationStatus["notDetermined"] = 0] = "notDetermined";
    AuthorizationStatus[AuthorizationStatus["sharingDenied"] = 1] = "sharingDenied";
    AuthorizationStatus[AuthorizationStatus["sharingAuthorized"] = 2] = "sharingAuthorized";
})(AuthorizationStatus || (exports.AuthorizationStatus = AuthorizationStatus = {}));
