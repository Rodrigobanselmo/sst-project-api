"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bioColumnsConstant = void 0;
const checkIsString_1 = require("../../../../../utils/validators/checkIsString");
exports.bioColumnsConstant = [
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
//# sourceMappingURL=bioColumns.constant.js.map