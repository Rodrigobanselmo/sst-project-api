"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CnpjFormatTransform = void 0;
const brazilian_utils_1 = require("@brazilian-utils/brazilian-utils");
const CnpjFormatTransform = (data) => {
    const cnpj = String(data.obj[data.key]);
    if (!cnpj)
        return null;
    if (typeof cnpj === 'string') {
        if ((0, brazilian_utils_1.isValidCNPJ)(cnpj)) {
            return (0, brazilian_utils_1.onlyNumbers)(cnpj);
        }
    }
    return null;
};
exports.CnpjFormatTransform = CnpjFormatTransform;
//# sourceMappingURL=cnpj-format.transform.js.map