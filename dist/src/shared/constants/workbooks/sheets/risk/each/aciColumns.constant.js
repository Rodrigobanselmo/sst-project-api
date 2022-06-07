"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aciColumnsConstant = void 0;
const checkIsString_1 = require("../../../../../utils/validators/checkIsString");
exports.aciColumnsConstant = [
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
];
//# sourceMappingURL=aciColumns.constant.js.map