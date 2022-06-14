"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CepFormatTransform = void 0;
const CepFormatTransform = (data) => {
    const cep = String(data.obj[data.key]);
    if (typeof cep === 'string') {
        const onlyNumbersCep = cep.replace(/\D+/g, '');
        if (onlyNumbersCep.length === 8) {
            return onlyNumbersCep;
        }
    }
    return null;
};
exports.CepFormatTransform = CepFormatTransform;
//# sourceMappingURL=cep-format.transform.js.map