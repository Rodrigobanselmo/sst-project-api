"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNormalize = void 0;
const checkNormalize = (value) => {
    const transformToString = String(value);
    const treatedString = transformToString
        .replace(/Á/g, 'ç')
        .replace(/«/g, 'ç')
        .replace(/Û/g, 'ó')
        .replace(/”/g, 'ó')
        .replace(/Ù/g, 'ô')
        .replace(/ı/g, 'õ')
        .replace(/’/g, 'õ')
        .replace(/√/g, 'ã')
        .replace(/„/g, 'ã')
        .replace(/¡/, 'á')
        .replace(/·/g, 'á')
        .replace(/¬/g, 'â')
        .replace(/\b,\b/g, 'â')
        .replace(/¿/g, 'à')
        .replace(/‡/g, 'à')
        .replace(/Õ/g, 'í')
        .replace(/Ì/g, 'í')
        .replace(/…/g, 'é')
        .replace(/È/g, 'é')
        .replace(/Í/g, 'è')
        .replace(/⁄/g, 'ú')
        .replace(/˙/g, 'ú')
        .replace(/ì/g, '"')
        .replace(/î/g, '"');
    return treatedString
        .toLocaleLowerCase()
        .replace(/∫ c/g, '°C')
        .replace(/^./, treatedString[0].toUpperCase());
};
exports.checkNormalize = checkNormalize;
//# sourceMappingURL=checkNormalize.js.map