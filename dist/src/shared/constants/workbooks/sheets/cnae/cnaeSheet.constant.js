"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cnaeSheetConstant = void 0;
const cnaeColumns_constant_1 = require("./cnaeColumns.constant");
const cnaeSheet_enum_1 = require("./cnaeSheet.enum");
exports.cnaeSheetConstant = {
    [cnaeSheet_enum_1.CnaeSheetEnum.CNAE]: {
        name: 'CNAE',
        id: cnaeSheet_enum_1.CnaeSheetEnum.CNAE,
        columns: cnaeColumns_constant_1.cnaeColumnsConstant,
    },
};
//# sourceMappingURL=cnaeSheet.constant.js.map