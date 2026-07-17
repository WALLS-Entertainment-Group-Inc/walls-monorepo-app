"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WheelchairUse = exports.FitzpatrickSkinType = exports.BiologicalSex = exports.BloodType = void 0;
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkbloodtype Apple Docs }
 */
var BloodType;
(function (BloodType) {
    BloodType[BloodType["notSet"] = 0] = "notSet";
    BloodType[BloodType["aPositive"] = 1] = "aPositive";
    BloodType[BloodType["aNegative"] = 2] = "aNegative";
    BloodType[BloodType["bPositive"] = 3] = "bPositive";
    BloodType[BloodType["bNegative"] = 4] = "bNegative";
    BloodType[BloodType["abPositive"] = 5] = "abPositive";
    BloodType[BloodType["abNegative"] = 6] = "abNegative";
    BloodType[BloodType["oPositive"] = 7] = "oPositive";
    BloodType[BloodType["oNegative"] = 8] = "oNegative";
})(BloodType || (exports.BloodType = BloodType = {}));
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkbiologicalsex Apple Docs }
 */
var BiologicalSex;
(function (BiologicalSex) {
    BiologicalSex[BiologicalSex["notSet"] = 0] = "notSet";
    BiologicalSex[BiologicalSex["female"] = 1] = "female";
    BiologicalSex[BiologicalSex["male"] = 2] = "male";
    BiologicalSex[BiologicalSex["other"] = 3] = "other";
})(BiologicalSex || (exports.BiologicalSex = BiologicalSex = {}));
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkfitzpatrickskintype Apple Docs }
 */
var FitzpatrickSkinType;
(function (FitzpatrickSkinType) {
    FitzpatrickSkinType[FitzpatrickSkinType["notSet"] = 0] = "notSet";
    FitzpatrickSkinType[FitzpatrickSkinType["I"] = 1] = "I";
    FitzpatrickSkinType[FitzpatrickSkinType["II"] = 2] = "II";
    FitzpatrickSkinType[FitzpatrickSkinType["III"] = 3] = "III";
    FitzpatrickSkinType[FitzpatrickSkinType["IV"] = 4] = "IV";
    FitzpatrickSkinType[FitzpatrickSkinType["V"] = 5] = "V";
    FitzpatrickSkinType[FitzpatrickSkinType["VI"] = 6] = "VI";
})(FitzpatrickSkinType || (exports.FitzpatrickSkinType = FitzpatrickSkinType = {}));
// Maps directly to https://developer.apple.com/documentation/healthkit/hkwheelchairuse
var WheelchairUse;
(function (WheelchairUse) {
    WheelchairUse[WheelchairUse["notSet"] = 0] = "notSet";
    WheelchairUse[WheelchairUse["notUsingWheelchair"] = 1] = "notUsingWheelchair";
    WheelchairUse[WheelchairUse["usingWheelchair"] = 2] = "usingWheelchair";
})(WheelchairUse || (exports.WheelchairUse = WheelchairUse = {}));
