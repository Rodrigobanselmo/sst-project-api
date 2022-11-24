"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CepFormatTransform = void 0;
const brazilian_utils_1 = require("@brazilian-utils/brazilian-utils");
const CepFormatTransform = (data) => {
    const cep = String(data.obj[data.key]);
    if (typeof cep === 'string') {
        const onlyNumbersCep = (0, brazilian_utils_1.onlyNumbers)(cep);
        if (onlyNumbersCep.length === 8) {
            return onlyNumbersCep;
        }
    }
    return null;
};
exports.CepFormatTransform = CepFormatTransform;
//# sourceMappingURL=cep-format.transform.js.map