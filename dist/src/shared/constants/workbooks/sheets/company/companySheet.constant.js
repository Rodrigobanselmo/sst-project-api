"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companySheetConstant = void 0;
const companyColumns_constant_1 = require("./companyColumns.constant");
const companySheet_enum_1 = require("./companySheet.enum");
exports.companySheetConstant = {
    [companySheet_enum_1.CompanySheetEnum.COMPANIES]: {
        name: 'Empresas',
        id: companySheet_enum_1.CompanySheetEnum.COMPANIES,
        columns: companyColumns_constant_1.companyColumnsConstant,
    },
};
//# sourceMappingURL=companySheet.constant.js.map