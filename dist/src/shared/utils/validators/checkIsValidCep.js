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
        if ((0, brazilian_utils_1.isValidCEP)(transformToString.padStart(8, '0')))
            return (0, brazilian_utils_1.onlyNumbers)(transformToString.padStart(8, '0'));
    }
    return false;
};
exports.checkIsValidCep = checkIsValidCep;
//# sourceMappingURL=checkIsValidCep.js.map