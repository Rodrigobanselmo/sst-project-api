"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyColumnsConstant = void 0;
const checkIdNumber_1 = require("../../../../../shared/utils/validators/checkIdNumber");
const checkIsString_1 = require("../../../../../shared/utils/validators/checkIsString");
const checkIsValidCep_1 = require("../../../../../shared/utils/validators/checkIsValidCep");
const checkIsValidCnpj_1 = require("../../../../../shared/utils/validators/checkIsValidCnpj");
exports.companyColumnsConstant = [
    {
        databaseName: 'cnpj',
        excelName: 'CNPJ',
        required: true,
        checkHandler: checkIsValidCnpj_1.checkIsValidCnpj,
    },
    {
        databaseName: 'name',
        excelName: 'Nome',
        required: true,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'fantasy',
        excelName: 'Nome fantasia',
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
        isArray: true,
        databaseName: 'primary_activity.code',
        excelName: 'Código das atividades primárias',
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        isArray: true,
        databaseName: 'secondary_activity.code',
        excelName: 'Código das atividades secundárias',
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'workspace.id',
        isId: true,
        excelName: 'ID (Área de trabalho)',
        isArray: true,
        required: false,
        checkHandler: checkIdNumber_1.checkIsNumber,
    },
    {
        databaseName: 'workspace.name',
        excelName: 'Nome da área de trabalho',
        isArray: true,
        required: true,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'workspace.address.cep',
        excelName: 'CEP',
        isArray: true,
        required: true,
        checkHandler: checkIsValidCep_1.checkIsValidCep,
    },
];
//# sourceMappingURL=companyColumns.constant.js.map