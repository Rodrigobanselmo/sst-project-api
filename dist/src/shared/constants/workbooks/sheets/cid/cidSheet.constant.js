"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cidSheetConstant = void 0;
const cidColumns_constant_1 = require("./cidColumns.constant");
const cidSheet_enum_1 = require("./cidSheet.enum");
exports.cidSheetConstant = {
    [cidSheet_enum_1.CidSheetEnum.CID]: {
        name: 'CID',
        id: cidSheet_enum_1.CidSheetEnum.CID,
        columns: cidColumns_constant_1.cidColumnsConstant,
    },
};
//# sourceMappingURL=cidSheet.constant.js.map