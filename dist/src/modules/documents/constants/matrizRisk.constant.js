"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matrixRisk = exports.matrixRiskMap = void 0;
const palette_1 = require("../../../shared/constants/palette");
exports.matrixRiskMap = {
    [0]: {
        label: 'Não informado',
        short: 'NA',
        intervention: 'NÃO INFORMADO',
        color: palette_1.palette.matrix[0].string,
        table: '',
        level: 1,
    },
    [1]: {
        label: 'Muito baixo',
        short: 'MB',
        intervention: 'AÇÃO SEM PRAZO',
        table: 'Muito Baixo\n(Aceitável)',
        color: palette_1.palette.matrix[1].string,
        level: 1,
    },
    [2]: {
        label: 'Baixo',
        short: 'B',
        intervention: 'AÇÃO PARA LONGO PRAZO',
        table: 'Baixo\n(Aceitável)',
        level: 2,
        color: palette_1.palette.matrix[2].string,
    },
    [3]: {
        label: 'Moderado',
        short: 'M',
        intervention: 'AÇÃO PARA MÉDIO PRAZO',
        table: 'Moderado\n(Aceitável)',
        color: palette_1.palette.matrix[3].string,
        level: 3,
    },
    [4]: {
        label: 'Alto',
        short: 'A',
        intervention: 'AÇÃO PARA CURTO PRAZO',
        table: 'Alto\n(Temp. Aceitável)',
        color: palette_1.palette.matrix[4].string,
        level: 4,
    },
    [5]: {
        label: 'Muito\nAlto',
        short: 'MA',
        intervention: 'AÇÃO IMEDIATA',
        table: 'Muito Alto\n(Inaceitável)',
        color: palette_1.palette.matrix[5].string,
        level: 5,
    },
    [6]: {
        label: 'Interromper\nAtividades',
        short: 'IA',
        intervention: 'INTERROMPER ATIVIDADES',
        table: 'Interromper\nAtividades',
        color: palette_1.palette.matrix[6].string,
        level: 6,
    },
};
exports.matrixRisk = [
    [2, 3, 4, 5, 5, 6],
    [2, 3, 3, 4, 5, 6],
    [2, 2, 3, 3, 4, 6],
    [1, 2, 2, 3, 3, 6],
    [1, 1, 2, 2, 2, 6],
];
//# sourceMappingURL=matrizRisk.constant.js.map