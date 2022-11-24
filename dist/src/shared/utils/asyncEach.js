"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncEach = void 0;
const asyncEach = async (arr, callbackFn) => {
    let count = 0;
    const returnCB = [];
    for (const value of arr) {
        const cb = await callbackFn(value, count);
        count++;
        returnCB.push(cb || undefined);
    }
    return returnCB;
};
exports.asyncEach = asyncEach;
//# sourceMappingURL=asyncEach.js.map