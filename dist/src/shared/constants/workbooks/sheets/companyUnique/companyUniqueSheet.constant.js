"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyUniqueSheetConstant = void 0;
const companyUniqueColumns_constant_1 = require("./companyUniqueColumns.constant");
const companyUniqueSheet_enum_1 = require("./companyUniqueSheet.enum");
exports.companyUniqueSheetConstant = {
    [companyUniqueSheet_enum_1.CompanyUniqueSheetEnum.COMPANIES]: {
        name: 'Empresa',
        id: companyUniqueSheet_enum_1.CompanyUniqueSheetEnum.COMPANIES,
        columns: companyUniqueColumns_constant_1.companyUniqueColumnsConstant,
    },
};
//# sourceMappingURL=companyUniqueSheet.constant.js.map