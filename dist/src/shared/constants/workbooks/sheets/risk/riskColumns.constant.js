"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.riskColumnsConstant = void 0;
const checkIdNumber_1 = require("../../../../../shared/utils/validators/checkIdNumber");
const checkIsString_1 = require("../../../../../shared/utils/validators/checkIsString");
const checkIsXTrue_1 = require("../../../../../shared/utils/validators/checkIsXTrue");
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
    {
        isArray: false,
        databaseName: 'isPGR',
        excelName: 'PGR',
        required: false,
        checkHandler: checkIsXTrue_1.checkIsXTrue,
        notes: () => ['Marcar com "X" para VERDADEIRO e vazio para falso'],
    },
    {
        isArray: false,
        databaseName: 'isPCMSO',
        excelName: 'PCMSO',
        required: false,
        checkHandler: checkIsXTrue_1.checkIsXTrue,
        notes: () => ['Marcar com "X" para VERDADEIRO e vazio para falso'],
    },
    {
        isArray: false,
        databaseName: 'isAso',
        excelName: 'ASO',
        required: false,
        checkHandler: checkIsXTrue_1.checkIsXTrue,
        notes: () => ['Marcar com "X" para VERDADEIRO e vazio para falso'],
    },
    {
        isArray: false,
        databaseName: 'isPPP',
        excelName: 'PPP',
        required: false,
        checkHandler: checkIsXTrue_1.checkIsXTrue,
        notes: () => ['Marcar com "X" para VERDADEIRO e vazio para falso'],
    },
    {
        isArray: false,
        databaseName: 'esocialCode',
        excelName: 'Código eSocial',
        required: false,
        checkHandler: checkIsString_1.checkIsString,
        notes: () => ['Código proveniente da tabela 24 do eSocial'],
    },
];
//# sourceMappingURL=riskColumns.constant.js.map