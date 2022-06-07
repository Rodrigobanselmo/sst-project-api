"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CepFormatTransform = void 0;
function FormatCep(cep) {
    if (cep.length !== 8)
        return null;
    return `${cep}`.substring(0, 5) + '-' + `${cep}`.substring(5, 8);
}
const CepFormatTransform = (data) => {
    const cep = String(data.obj[data.key]);
    if (typeof cep === 'string') {
        const onlyNumbersCep = cep.replace(/\D+/g, '');
        if (onlyNumbersCep.length === 8) {
            const formattedCep = FormatCep(onlyNumbersCep);
            if (formattedCep)
                return formattedCep;
        }
    }
    return null;
};
exports.CepFormatTransform = CepFormatTransform;
//# sourceMappingURL=cep-format.transform.js.map