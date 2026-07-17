"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeartRateMotionContext = exports.InsulinDeliveryReason = void 0;
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkinsulindeliveryreason Apple Docs }
 */
var InsulinDeliveryReason;
(function (InsulinDeliveryReason) {
    InsulinDeliveryReason[InsulinDeliveryReason["basal"] = 1] = "basal";
    InsulinDeliveryReason[InsulinDeliveryReason["bolus"] = 2] = "bolus";
})(InsulinDeliveryReason || (exports.InsulinDeliveryReason = InsulinDeliveryReason = {}));
var HeartRateMotionContext;
(function (HeartRateMotionContext) {
    HeartRateMotionContext[HeartRateMotionContext["active"] = 2] = "active";
    HeartRateMotionContext[HeartRateMotionContext["notSet"] = 0] = "notSet";
    HeartRateMotionContext[HeartRateMotionContext["sedentary"] = 1] = "sedentary";
})(HeartRateMotionContext || (exports.HeartRateMotionContext = HeartRateMotionContext = {}));
