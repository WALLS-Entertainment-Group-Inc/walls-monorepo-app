"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateOfMindAssociation = exports.StateOfMindKind = exports.StateOfMindLabel = exports.StateOfMindValenceClassification = void 0;
var StateOfMindValenceClassification;
(function (StateOfMindValenceClassification) {
    StateOfMindValenceClassification[StateOfMindValenceClassification["veryUnpleasant"] = 1] = "veryUnpleasant";
    StateOfMindValenceClassification[StateOfMindValenceClassification["unpleasant"] = 2] = "unpleasant";
    StateOfMindValenceClassification[StateOfMindValenceClassification["slightlyUnpleasant"] = 3] = "slightlyUnpleasant";
    StateOfMindValenceClassification[StateOfMindValenceClassification["neutral"] = 4] = "neutral";
    StateOfMindValenceClassification[StateOfMindValenceClassification["slightlyPleasant"] = 5] = "slightlyPleasant";
    StateOfMindValenceClassification[StateOfMindValenceClassification["pleasant"] = 6] = "pleasant";
    StateOfMindValenceClassification[StateOfMindValenceClassification["veryPleasant"] = 7] = "veryPleasant";
})(StateOfMindValenceClassification || (exports.StateOfMindValenceClassification = StateOfMindValenceClassification = {}));
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkstateofmind/label Apple Docs}
 */
var StateOfMindLabel;
(function (StateOfMindLabel) {
    StateOfMindLabel[StateOfMindLabel["amazed"] = 1] = "amazed";
    StateOfMindLabel[StateOfMindLabel["amused"] = 2] = "amused";
    StateOfMindLabel[StateOfMindLabel["angry"] = 3] = "angry";
    StateOfMindLabel[StateOfMindLabel["anxious"] = 4] = "anxious";
    StateOfMindLabel[StateOfMindLabel["ashamed"] = 5] = "ashamed";
    StateOfMindLabel[StateOfMindLabel["brave"] = 6] = "brave";
    StateOfMindLabel[StateOfMindLabel["calm"] = 7] = "calm";
    StateOfMindLabel[StateOfMindLabel["content"] = 8] = "content";
    StateOfMindLabel[StateOfMindLabel["disappointed"] = 9] = "disappointed";
    StateOfMindLabel[StateOfMindLabel["discouraged"] = 10] = "discouraged";
    StateOfMindLabel[StateOfMindLabel["disgusted"] = 11] = "disgusted";
    StateOfMindLabel[StateOfMindLabel["embarrassed"] = 12] = "embarrassed";
    StateOfMindLabel[StateOfMindLabel["excited"] = 13] = "excited";
    StateOfMindLabel[StateOfMindLabel["frustrated"] = 14] = "frustrated";
    StateOfMindLabel[StateOfMindLabel["grateful"] = 15] = "grateful";
    StateOfMindLabel[StateOfMindLabel["guilty"] = 16] = "guilty";
    StateOfMindLabel[StateOfMindLabel["happy"] = 17] = "happy";
    StateOfMindLabel[StateOfMindLabel["hopeless"] = 18] = "hopeless";
    StateOfMindLabel[StateOfMindLabel["irritated"] = 19] = "irritated";
    StateOfMindLabel[StateOfMindLabel["jealous"] = 20] = "jealous";
    StateOfMindLabel[StateOfMindLabel["joyful"] = 21] = "joyful";
    StateOfMindLabel[StateOfMindLabel["lonely"] = 22] = "lonely";
    StateOfMindLabel[StateOfMindLabel["passionate"] = 23] = "passionate";
    StateOfMindLabel[StateOfMindLabel["peaceful"] = 24] = "peaceful";
    StateOfMindLabel[StateOfMindLabel["proud"] = 25] = "proud";
    StateOfMindLabel[StateOfMindLabel["relieved"] = 26] = "relieved";
    StateOfMindLabel[StateOfMindLabel["sad"] = 27] = "sad";
    StateOfMindLabel[StateOfMindLabel["scared"] = 28] = "scared";
    StateOfMindLabel[StateOfMindLabel["stressed"] = 29] = "stressed";
    StateOfMindLabel[StateOfMindLabel["surprised"] = 30] = "surprised";
    StateOfMindLabel[StateOfMindLabel["worried"] = 31] = "worried";
    StateOfMindLabel[StateOfMindLabel["annoyed"] = 32] = "annoyed";
    StateOfMindLabel[StateOfMindLabel["confident"] = 33] = "confident";
    StateOfMindLabel[StateOfMindLabel["drained"] = 34] = "drained";
    StateOfMindLabel[StateOfMindLabel["hopeful"] = 35] = "hopeful";
    StateOfMindLabel[StateOfMindLabel["indifferent"] = 36] = "indifferent";
    StateOfMindLabel[StateOfMindLabel["overwhelmed"] = 37] = "overwhelmed";
    StateOfMindLabel[StateOfMindLabel["satisfied"] = 38] = "satisfied";
})(StateOfMindLabel || (exports.StateOfMindLabel = StateOfMindLabel = {}));
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkstateofmind/kind Apple Docs}
 */
var StateOfMindKind;
(function (StateOfMindKind) {
    StateOfMindKind[StateOfMindKind["dailyMood"] = 2] = "dailyMood";
    StateOfMindKind[StateOfMindKind["momentaryEmotion"] = 1] = "momentaryEmotion";
})(StateOfMindKind || (exports.StateOfMindKind = StateOfMindKind = {}));
/**
 * @see {@link https://developer.apple.com/documentation/healthkit/hkstateofmind/association Apple Docs}
 * @since iOS 17.0+
 */
var StateOfMindAssociation;
(function (StateOfMindAssociation) {
    StateOfMindAssociation[StateOfMindAssociation["community"] = 1] = "community";
    StateOfMindAssociation[StateOfMindAssociation["currentEvents"] = 2] = "currentEvents";
    StateOfMindAssociation[StateOfMindAssociation["dating"] = 3] = "dating";
    StateOfMindAssociation[StateOfMindAssociation["education"] = 4] = "education";
    StateOfMindAssociation[StateOfMindAssociation["family"] = 5] = "family";
    StateOfMindAssociation[StateOfMindAssociation["fitness"] = 6] = "fitness";
    StateOfMindAssociation[StateOfMindAssociation["friends"] = 7] = "friends";
    StateOfMindAssociation[StateOfMindAssociation["health"] = 8] = "health";
    StateOfMindAssociation[StateOfMindAssociation["hobbies"] = 9] = "hobbies";
    StateOfMindAssociation[StateOfMindAssociation["identity"] = 10] = "identity";
    StateOfMindAssociation[StateOfMindAssociation["money"] = 11] = "money";
    StateOfMindAssociation[StateOfMindAssociation["partner"] = 12] = "partner";
    StateOfMindAssociation[StateOfMindAssociation["selfCare"] = 13] = "selfCare";
    StateOfMindAssociation[StateOfMindAssociation["spirituality"] = 14] = "spirituality";
    StateOfMindAssociation[StateOfMindAssociation["tasks"] = 15] = "tasks";
    StateOfMindAssociation[StateOfMindAssociation["travel"] = 16] = "travel";
    StateOfMindAssociation[StateOfMindAssociation["work"] = 17] = "work";
    StateOfMindAssociation[StateOfMindAssociation["weather"] = 18] = "weather";
})(StateOfMindAssociation || (exports.StateOfMindAssociation = StateOfMindAssociation = {}));
