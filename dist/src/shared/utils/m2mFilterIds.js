"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.m2mGetDeletedIds = void 0;
const m2mGetDeletedIds = (dbArray, sendArray, compareFieldSend, compareFieldDb) => {
    return dbArray
        .filter((dbData) => !sendArray.find((sendData) => {
        return typeof sendData === 'string'
            ? sendData === dbData[compareFieldDb || compareFieldSend]
            : sendData[compareFieldSend] === dbData[compareFieldDb || compareFieldSend];
    }))
        .map((data) => data[compareFieldDb || compareFieldSend]);
};
exports.m2mGetDeletedIds = m2mGetDeletedIds;
//# sourceMappingURL=m2mFilterIds.js.map