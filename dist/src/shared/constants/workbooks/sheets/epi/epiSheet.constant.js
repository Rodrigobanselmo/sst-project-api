"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.epiSheetConstant = void 0;
const epiColumns_constant_1 = require("./epiColumns.constant");
const epiSheet_enum_1 = require("./epiSheet.enum");
exports.epiSheetConstant = {
    [epiSheet_enum_1.EpiSheetEnum.EPI]: {
        name: 'EPI',
        id: epiSheet_enum_1.EpiSheetEnum.EPI,
        columns: epiColumns_constant_1.epiColumnsConstant,
    },
};
//# sourceMappingURL=epiSheet.constant.js.map