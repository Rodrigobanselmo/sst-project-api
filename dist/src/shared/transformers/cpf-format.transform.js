"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CpfFormatTransform = void 0;
const brazilian_utils_1 = require("@brazilian-utils/brazilian-utils");
const CpfFormatTransform = (data) => {
    const cpf = String(data.obj[data.key]);
    if (!cpf)
        return null;
    if (typeof cpf === 'string') {
        if ((0, brazilian_utils_1.isValidCPF)(cpf)) {
            return (0, brazilian_utils_1.formatCPF)(cpf);
        }
    }
    return null;
};
exports.CpfFormatTransform = CpfFormatTransform;
//# sourceMappingURL=cpf-format.transform.js.map