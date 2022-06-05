"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quiColumnsConstant = void 0;
const checkIsString_1 = require("../../../../../utils/validators/checkIsString");
exports.quiColumnsConstant = [
    {
        databaseName: 'cas',
        excelName: 'Nº CAS',
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'breather',
        excelName: 'Respirador/Filtro',
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
        databaseName: 'nr15lt',
        excelName: 'NR-15 LT (ppm)',
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'twa',
        excelName: 'ACGIH TWA',
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'stel',
        excelName: 'ACGIH STEL ',
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'ipvs',
        excelName: 'IPVS/IDHL',
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'pv',
        excelName: 'PV (mmHg)  ',
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'pe',
        excelName: 'PE (ºC)  ',
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'carnogenicityACGIH',
        excelName: `Carcinogenicidade ACGIH  `,
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'carnogenicityLinach',
        excelName: 'Carcinogenicidade LINACH ',
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
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
        databaseName: 'appendix',
        excelName: 'Anexo',
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
];
//# sourceMappingURL=quiColumns.constant.js.map