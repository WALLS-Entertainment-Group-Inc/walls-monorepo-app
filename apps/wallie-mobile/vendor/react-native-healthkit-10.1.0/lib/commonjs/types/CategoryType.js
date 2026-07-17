"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValueAppleStandHour = exports.CategoryValueLowCardioFitnessEvent = exports.CategoryValueNotApplicable = exports.CategoryValueSeverity = exports.CategoryValuePresence = exports.CategoryValueAppetiteChanges = exports.CategoryValueSleepAnalysis = exports.CategoryValueOvulationTestResult = exports.CategoryValueMenstrualFlow = exports.CategoryValueCervicalMucusQuality = void 0;
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvaluepregnancytestresult Apple Docs }
 */
var CategoryValuePregnancyTestResult;
(function (CategoryValuePregnancyTestResult) {
    CategoryValuePregnancyTestResult[CategoryValuePregnancyTestResult["positive"] = 2] = "positive";
    CategoryValuePregnancyTestResult[CategoryValuePregnancyTestResult["negative"] = 1] = "negative";
    CategoryValuePregnancyTestResult[CategoryValuePregnancyTestResult["indeterminate"] = 3] = "indeterminate";
})(CategoryValuePregnancyTestResult || (CategoryValuePregnancyTestResult = {}));
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvaluecervicalmucusquality Apple Docs }
 */
var CategoryValueCervicalMucusQuality;
(function (CategoryValueCervicalMucusQuality) {
    CategoryValueCervicalMucusQuality[CategoryValueCervicalMucusQuality["dry"] = 1] = "dry";
    CategoryValueCervicalMucusQuality[CategoryValueCervicalMucusQuality["sticky"] = 2] = "sticky";
    CategoryValueCervicalMucusQuality[CategoryValueCervicalMucusQuality["creamy"] = 3] = "creamy";
    CategoryValueCervicalMucusQuality[CategoryValueCervicalMucusQuality["watery"] = 4] = "watery";
    CategoryValueCervicalMucusQuality[CategoryValueCervicalMucusQuality["eggWhite"] = 5] = "eggWhite";
})(CategoryValueCervicalMucusQuality || (exports.CategoryValueCervicalMucusQuality = CategoryValueCervicalMucusQuality = {}));
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvaluemenstrualflow Apple Docs }
 */
var CategoryValueMenstrualFlow;
(function (CategoryValueMenstrualFlow) {
    CategoryValueMenstrualFlow[CategoryValueMenstrualFlow["unspecified"] = 1] = "unspecified";
    CategoryValueMenstrualFlow[CategoryValueMenstrualFlow["none"] = 5] = "none";
    CategoryValueMenstrualFlow[CategoryValueMenstrualFlow["light"] = 2] = "light";
    CategoryValueMenstrualFlow[CategoryValueMenstrualFlow["medium"] = 3] = "medium";
    CategoryValueMenstrualFlow[CategoryValueMenstrualFlow["heavy"] = 4] = "heavy";
})(CategoryValueMenstrualFlow || (exports.CategoryValueMenstrualFlow = CategoryValueMenstrualFlow = {}));
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvalueovulationtestresult Apple Docs }
 */
var CategoryValueOvulationTestResult;
(function (CategoryValueOvulationTestResult) {
    CategoryValueOvulationTestResult[CategoryValueOvulationTestResult["negative"] = 1] = "negative";
    CategoryValueOvulationTestResult[CategoryValueOvulationTestResult["luteinizingHormoneSurge"] = 2] = "luteinizingHormoneSurge";
    CategoryValueOvulationTestResult[CategoryValueOvulationTestResult["indeterminate"] = 3] = "indeterminate";
    CategoryValueOvulationTestResult[CategoryValueOvulationTestResult["estrogenSurge"] = 4] = "estrogenSurge";
})(CategoryValueOvulationTestResult || (exports.CategoryValueOvulationTestResult = CategoryValueOvulationTestResult = {}));
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvaluesleepanalysis Apple Docs }
 */
var CategoryValueSleepAnalysis;
(function (CategoryValueSleepAnalysis) {
    CategoryValueSleepAnalysis[CategoryValueSleepAnalysis["inBed"] = 0] = "inBed";
    CategoryValueSleepAnalysis[CategoryValueSleepAnalysis["asleepUnspecified"] = 1] = "asleepUnspecified";
    CategoryValueSleepAnalysis[CategoryValueSleepAnalysis["awake"] = 2] = "awake";
    CategoryValueSleepAnalysis[CategoryValueSleepAnalysis["asleepCore"] = 3] = "asleepCore";
    CategoryValueSleepAnalysis[CategoryValueSleepAnalysis["asleepDeep"] = 4] = "asleepDeep";
    CategoryValueSleepAnalysis[CategoryValueSleepAnalysis["asleepREM"] = 5] = "asleepREM";
})(CategoryValueSleepAnalysis || (exports.CategoryValueSleepAnalysis = CategoryValueSleepAnalysis = {}));
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvalueappetitechanges Apple Docs}
 */
var CategoryValueAppetiteChanges;
(function (CategoryValueAppetiteChanges) {
    CategoryValueAppetiteChanges[CategoryValueAppetiteChanges["decreased"] = 2] = "decreased";
    CategoryValueAppetiteChanges[CategoryValueAppetiteChanges["increased"] = 3] = "increased";
    CategoryValueAppetiteChanges[CategoryValueAppetiteChanges["noChange"] = 1] = "noChange";
    CategoryValueAppetiteChanges[CategoryValueAppetiteChanges["unspecified"] = 0] = "unspecified";
})(CategoryValueAppetiteChanges || (exports.CategoryValueAppetiteChanges = CategoryValueAppetiteChanges = {}));
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvaluepresence Apple Docs}
 */
var CategoryValuePresence;
(function (CategoryValuePresence) {
    CategoryValuePresence[CategoryValuePresence["notPresent"] = 1] = "notPresent";
    CategoryValuePresence[CategoryValuePresence["present"] = 0] = "present";
})(CategoryValuePresence || (exports.CategoryValuePresence = CategoryValuePresence = {}));
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvalueseverity Apple Docs }
 */
var CategoryValueSeverity;
(function (CategoryValueSeverity) {
    CategoryValueSeverity[CategoryValueSeverity["notPresent"] = 1] = "notPresent";
    CategoryValueSeverity[CategoryValueSeverity["mild"] = 2] = "mild";
    CategoryValueSeverity[CategoryValueSeverity["moderate"] = 3] = "moderate";
    CategoryValueSeverity[CategoryValueSeverity["severe"] = 4] = "severe";
    CategoryValueSeverity[CategoryValueSeverity["unspecified"] = 0] = "unspecified";
})(CategoryValueSeverity || (exports.CategoryValueSeverity = CategoryValueSeverity = {}));
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkcategoryvalue/notapplicable Apple Docs }
 */
var CategoryValueNotApplicable;
(function (CategoryValueNotApplicable) {
    CategoryValueNotApplicable[CategoryValueNotApplicable["notApplicable"] = 0] = "notApplicable";
})(CategoryValueNotApplicable || (exports.CategoryValueNotApplicable = CategoryValueNotApplicable = {}));
var CategoryValueLowCardioFitnessEvent;
(function (CategoryValueLowCardioFitnessEvent) {
    CategoryValueLowCardioFitnessEvent[CategoryValueLowCardioFitnessEvent["lowFitness"] = 1] = "lowFitness";
})(CategoryValueLowCardioFitnessEvent || (exports.CategoryValueLowCardioFitnessEvent = CategoryValueLowCardioFitnessEvent = {}));
var CategoryValueAppleStandHour;
(function (CategoryValueAppleStandHour) {
    CategoryValueAppleStandHour[CategoryValueAppleStandHour["stood"] = 0] = "stood";
    CategoryValueAppleStandHour[CategoryValueAppleStandHour["idle"] = 1] = "idle";
})(CategoryValueAppleStandHour || (exports.CategoryValueAppleStandHour = CategoryValueAppleStandHour = {}));
