"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ergColumnsConstant = void 0;
const checkIsString_1 = require("../../../../../utils/validators/checkIsString");
exports.ergColumnsConstant = [
    {
        databaseName: 'unit',
        excelName: 'Unidade',
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
//# sourceMappingURL=ergColumns.constant.js.map