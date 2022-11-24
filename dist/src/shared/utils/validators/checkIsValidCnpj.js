"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsValidCnpj = void 0;
const brazilian_utils_1 = require("@brazilian-utils/brazilian-utils");
const checkIsValidCnpj = (value) => {
    const transformToString = String(value);
    if (!transformToString) {
        return false;
    }
    if (typeof transformToString === 'string') {
        if ((0, brazilian_utils_1.isValidCNPJ)(transformToString.padStart(14, '0')))
            return (0, brazilian_utils_1.onlyNumbers)(transformToString.padStart(14, '0'));
    }
    return false;
};
exports.checkIsValidCnpj = checkIsValidCnpj;
//# sourceMappingURL=checkIsValidCnpj.js.map