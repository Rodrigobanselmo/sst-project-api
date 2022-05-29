"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsString = void 0;
const checkIsString = (value) => {
    const transformToString = String(value);
    if (!transformToString && transformToString !== '') {
        return false;
    }
    if (typeof transformToString === 'string') {
        return transformToString;
    }
    return false;
};
exports.checkIsString = checkIsString;
//# sourceMappingURL=checkIsString.js.map