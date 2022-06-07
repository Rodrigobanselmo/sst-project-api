"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncSome = void 0;
const asyncSome = async (arr, callbackFn) => {
    let index = 0;
    for (const e of arr) {
        if (await callbackFn(e, index))
            return true;
        index++;
    }
    return false;
};
exports.asyncSome = asyncSome;
//# sourceMappingURL=asyncSome.utils.js.map