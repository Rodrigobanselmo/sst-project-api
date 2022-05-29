"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncEach = void 0;
const asyncEach = async (arr, callbackFn) => {
    for (const value of arr)
        await callbackFn(value);
};
exports.asyncEach = asyncEach;
//# sourceMappingURL=asyncEach.js.map