"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToChanges = void 0;
const modules_1 = require("../modules");
const subscribeToChanges = (identifier, callback) => {
    const queryId = modules_1.Core.subscribeToObserverQuery(identifier, callback);
    return {
        remove: () => modules_1.Core.unsubscribeQuery(queryId),
    };
};
exports.subscribeToChanges = subscribeToChanges;
