"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsValidCid = void 0;
const checkIsValidCid = (value) => {
    const transformToString = String(value);
    if (!transformToString) {
        return false;
    }
    if (typeof transformToString === 'string') {
        if (transformToString.length == 3)
            return transformToString;
    }
    return false;
};
exports.checkIsValidCid = checkIsValidCid;
//# sourceMappingURL=checkIsValidCid.js.map