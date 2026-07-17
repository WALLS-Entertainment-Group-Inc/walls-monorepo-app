/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkbloodtype Apple Docs }
 */
export var BloodType;
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
})(BloodType || (BloodType = {}));
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkbiologicalsex Apple Docs }
 */
export var BiologicalSex;
(function (BiologicalSex) {
    BiologicalSex[BiologicalSex["notSet"] = 0] = "notSet";
    BiologicalSex[BiologicalSex["female"] = 1] = "female";
    BiologicalSex[BiologicalSex["male"] = 2] = "male";
    BiologicalSex[BiologicalSex["other"] = 3] = "other";
})(BiologicalSex || (BiologicalSex = {}));
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkfitzpatrickskintype Apple Docs }
 */
export var FitzpatrickSkinType;
(function (FitzpatrickSkinType) {
    FitzpatrickSkinType[FitzpatrickSkinType["notSet"] = 0] = "notSet";
    FitzpatrickSkinType[FitzpatrickSkinType["I"] = 1] = "I";
    FitzpatrickSkinType[FitzpatrickSkinType["II"] = 2] = "II";
    FitzpatrickSkinType[FitzpatrickSkinType["III"] = 3] = "III";
    FitzpatrickSkinType[FitzpatrickSkinType["IV"] = 4] = "IV";
    FitzpatrickSkinType[FitzpatrickSkinType["V"] = 5] = "V";
    FitzpatrickSkinType[FitzpatrickSkinType["VI"] = 6] = "VI";
})(FitzpatrickSkinType || (FitzpatrickSkinType = {}));
// Maps directly to https://developer.apple.com/documentation/healthkit/hkwheelchairuse
export var WheelchairUse;
(function (WheelchairUse) {
    WheelchairUse[WheelchairUse["notSet"] = 0] = "notSet";
    WheelchairUse[WheelchairUse["notUsingWheelchair"] = 1] = "notUsingWheelchair";
    WheelchairUse[WheelchairUse["usingWheelchair"] = 2] = "usingWheelchair";
})(WheelchairUse || (WheelchairUse = {}));
