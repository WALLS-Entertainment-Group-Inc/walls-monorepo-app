"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHealthkitAuthorization = void 0;
const react_1 = require("react");
const modules_1 = require("../modules");
/**
 * @description Hook to retrieve the current authorization status for the given types, and request authorization if needed.
 * @see {@link https://developer.apple.com/documentation/healthkit/hkhealthstore/1614152-requestauthorization Apple Docs - requestAuthorization}
 * @see {@link https://developer.apple.com/documentation/healthkit/authorizing_access_to_health_data Apple Docs - Authorizing access to health data}
 */
const useHealthkitAuthorization = (read, write) => {
    const [status, setStatus] = (0, react_1.useState)(null);
    const readMemo = (0, react_1.useRef)(read);
    const writeMemo = (0, react_1.useRef)(write);
    (0, react_1.useEffect)(() => {
        readMemo.current = read;
        writeMemo.current = write;
    }, [read, write]);
    const refreshAuthStatus = (0, react_1.useCallback)(async () => {
        const auth = await modules_1.Core.getRequestStatusForAuthorization(writeMemo.current ?? [], readMemo.current);
        setStatus(auth);
        return auth;
    }, []);
    const request = (0, react_1.useCallback)(async () => {
        await modules_1.Core.requestAuthorization(writeMemo.current ?? [], readMemo.current);
        return refreshAuthStatus();
    }, [refreshAuthStatus]);
    (0, react_1.useEffect)(() => {
        void refreshAuthStatus();
    }, [refreshAuthStatus]);
    return [status, request];
};
exports.useHealthkitAuthorization = useHealthkitAuthorization;
exports.default = exports.useHealthkitAuthorization;
