"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.epiColumnsConstant = void 0;
const checkIsValidDate_1 = require("../../../../utils/validators/checkIsValidDate");
const checkIsNational_1 = require("../../../../utils/validators/epiTable/checkIsNational");
const checkNormalize_1 = require("../../../../utils/validators/epiTable/checkNormalize");
const checkSituation_1 = require("../../../../utils/validators/epiTable/checkSituation");
const checkIsString_1 = require("../../../../utils/validators/checkIsString");
exports.epiColumnsConstant = [
    {
        isId: true,
        databaseName: 'ca',
        excelName: 'CA',
        required: true,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'expiredDate',
        excelName: 'Validade',
        required: true,
        checkHandler: checkIsValidDate_1.checkIsValidDate,
    },
    {
        databaseName: 'isValid',
        excelName: 'Situação',
        required: true,
        checkHandler: checkSituation_1.checkSituation,
    },
    {
        databaseName: 'national',
        excelName: 'Natureza',
        required: true,
        checkHandler: checkIsNational_1.checkIsNational,
    },
    {
        databaseName: 'equipment',
        excelName: 'NomeEquipamento',
        required: true,
        checkHandler: checkNormalize_1.checkNormalize,
    },
    {
        databaseName: 'description',
        excelName: 'DescricaoEquipamento',
        checkHandler: checkNormalize_1.checkNormalize,
    },
    {
        databaseName: 'report',
        excelName: 'AprovadoParaLaudo',
        checkHandler: checkNormalize_1.checkNormalize,
    },
    {
        databaseName: 'restriction',
        excelName: 'RestricaoLaudo',
        checkHandler: checkNormalize_1.checkNormalize,
    },
    {
        databaseName: 'observation',
        excelName: 'ObservacaoAnaliseLaudo',
        checkHandler: checkNormalize_1.checkNormalize,
    },
];
//# sourceMappingURL=epiColumns.constant.js.map