"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsValidCpf = void 0;
const brazilian_utils_1 = require("@brazilian-utils/brazilian-utils");
const checkIsValidCpf = (value) => {
    const transformToString = String(value);
    if (!transformToString) {
        return false;
    }
    if (typeof transformToString === 'string') {
        if ((0, brazilian_utils_1.isValidCPF)(transformToString))
            return (0, brazilian_utils_1.onlyNumbers)(transformToString);
    }
    return false;
};
exports.checkIsValidCpf = checkIsValidCpf;
//# sourceMappingURL=checkIsValidCpf.js.map