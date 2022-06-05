"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsValidCep = void 0;
const brazilian_utils_1 = require("@brazilian-utils/brazilian-utils");
const checkIsValidCep = (value) => {
    const transformToString = String(value);
    if (!transformToString) {
        return false;
    }
    if (typeof transformToString === 'string') {
        if ((0, brazilian_utils_1.isValidCEP)(transformToString))
            return (0, brazilian_utils_1.formatCEP)(transformToString);
    }
    return false;
};
exports.checkIsValidCep = checkIsValidCep;
//# sourceMappingURL=checkIsValidCep.js.map