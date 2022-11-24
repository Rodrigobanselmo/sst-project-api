"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cnaeColumnsConstant = void 0;
const checkIdNumber_1 = require("./../../../../utils/validators/checkIdNumber");
const checkIsValidCnae_1 = require("../../../../utils/validators/checkIsValidCnae");
const checkIsString_1 = require("../../../../utils/validators/checkIsString");
exports.cnaeColumnsConstant = [
    {
        isId: true,
        databaseName: 'code',
        excelName: 'Código',
        required: true,
        checkHandler: checkIsValidCnae_1.checkIsValidCnae,
    },
    {
        databaseName: 'name',
        excelName: 'Descrição',
        required: true,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'riskDegree',
        excelName: 'Grau de Risco',
        required: true,
        checkHandler: checkIdNumber_1.checkIsNumber,
    },
];
//# sourceMappingURL=cnaeColumns.constant.js.map