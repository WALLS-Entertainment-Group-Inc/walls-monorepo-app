"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFrequency = void 0;
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkupdatefrequency Apple Docs }
 */
var UpdateFrequency;
(function (UpdateFrequency) {
    UpdateFrequency[UpdateFrequency["immediate"] = 1] = "immediate";
    UpdateFrequency[UpdateFrequency["hourly"] = 2] = "hourly";
    UpdateFrequency[UpdateFrequency["daily"] = 3] = "daily";
    UpdateFrequency[UpdateFrequency["weekly"] = 4] = "weekly";
})(UpdateFrequency || (exports.UpdateFrequency = UpdateFrequency = {}));
