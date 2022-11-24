"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cidColumnsConstant = void 0;
const checkIsString_1 = require("../../../../utils/validators/checkIsString");
const checkIsValidCid_1 = require("../../../../utils/validators/checkIsValidCid");
exports.cidColumnsConstant = [
    {
        isId: true,
        databaseName: 'cid',
        excelName: 'CID-10',
        required: true,
        checkHandler: checkIsValidCid_1.checkIsValidCid,
    },
    {
        databaseName: 'description',
        excelName: 'Descrição',
        required: true,
        checkHandler: checkIsString_1.checkIsString,
    },
];
//# sourceMappingURL=cidColumns.constant.js.map