"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.riskColumnsConstant = void 0;
const checkIdNumber_1 = require("../../../../../shared/utils/validators/checkIdNumber");
const checkIsString_1 = require("../../../../../shared/utils/validators/checkIsString");
exports.riskColumnsConstant = [
    {
        databaseName: 'name',
        excelName: 'Descrição',
        required: true,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'id',
        isId: true,
        excelName: 'ID',
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'severity',
        excelName: 'Severidade',
        required: false,
        checkHandler: checkIdNumber_1.checkIsNumber,
    },
    {
        databaseName: 'risk',
        excelName: 'Risco (Órgãos Alvo ou Maior Parte do Corpo Prejudicada -Resumo de Sintomas)',
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'symptoms',
        excelName: 'Sintomas, Danos ou Qualquer  consequência negativa',
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        isArray: true,
        databaseName: 'propagation',
        excelName: 'Meio de propagação',
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
];
//# sourceMappingURL=riskColumns.constant.js.map