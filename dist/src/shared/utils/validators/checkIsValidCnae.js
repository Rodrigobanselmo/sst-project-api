"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsValidCnae = void 0;
const brazilian_utils_1 = require("@brazilian-utils/brazilian-utils");
const checkIsValidCnae = (value) => {
    const transformToString = String(value);
    if (!transformToString) {
        return false;
    }
    if (typeof transformToString === 'string') {
        if ((0, brazilian_utils_1.onlyNumbers)(transformToString).length == 7)
            return (0, brazilian_utils_1.onlyNumbers)(transformToString);
    }
    return false;
};
exports.checkIsValidCnae = checkIsValidCnae;
//# sourceMappingURL=checkIsValidCnae.js.map