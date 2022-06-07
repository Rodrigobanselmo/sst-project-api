"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsNumber = void 0;
const checkIsNumber = (value) => {
    const transformToNumber = Number(value);
    if (!transformToNumber && transformToNumber !== 0) {
        return false;
    }
    if (typeof transformToNumber === 'number') {
        return transformToNumber;
    }
    return false;
};
exports.checkIsNumber = checkIsNumber;
//# sourceMappingURL=checkIdNumber.js.map