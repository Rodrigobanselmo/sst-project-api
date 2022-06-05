"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hierarchiesSheetConstant = void 0;
const hierarchiesColumns_constant_1 = require("./hierarchiesColumns.constant");
const hierarchies_enum_1 = require("./hierarchies.enum");
exports.hierarchiesSheetConstant = {
    [hierarchies_enum_1.HierarchiesSheetEnum.HIERARCHIES]: {
        name: 'Empregados',
        id: hierarchies_enum_1.HierarchiesSheetEnum.HIERARCHIES,
        columns: hierarchiesColumns_constant_1.hierarchiesColumnsConstant,
    },
};
//# sourceMappingURL=hierarchiesSheet.constant.js.map