"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phyColumnsConstant = void 0;
const checkIsString_1 = require("../../../../../../shared/utils/validators/checkIsString");
exports.phyColumnsConstant = [
    {
        databaseName: 'exame',
        excelName: 'BEI/Exame Complementar (ACGIH/NR07) ou Critério Médico',
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'method',
        excelName: 'Método Amostragem',
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'unit',
        excelName: 'Unidade',
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'appendix',
        excelName: 'Anexo',
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
];
//# sourceMappingURL=fisColumns.constant.js.map