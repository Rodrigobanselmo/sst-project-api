"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workbooksConstant = void 0;
const workbooks_enum_1 = require("../../../shared/constants/workbooks/workbooks.enum");
const companySheet_constant_1 = require("./sheets/company/companySheet.constant");
const companyUniqueSheet_constant_1 = require("./sheets/companyUnique/companyUniqueSheet.constant");
const employeesSheet_constant_1 = require("./sheets/employees/employeesSheet.constant");
const epiSheet_constant_1 = require("./sheets/epi/epiSheet.constant");
const hierarchiesSheet_constant_1 = require("./sheets/hierarchies/hierarchiesSheet.constant");
const riskSheet_constant_1 = require("./sheets/risk/riskSheet.constant");
exports.workbooksConstant = {
    [workbooks_enum_1.WorkbooksEnum.RISK]: {
        name: 'Fatores de riscos',
        id: workbooks_enum_1.WorkbooksEnum.RISK,
        sheets: riskSheet_constant_1.riskSheetConstant,
        path: 'files/checklist',
    },
    [workbooks_enum_1.WorkbooksEnum.COMPANIES]: {
        name: 'Empresas',
        id: workbooks_enum_1.WorkbooksEnum.COMPANIES,
        sheets: companySheet_constant_1.companySheetConstant,
        path: 'files/company',
    },
    [workbooks_enum_1.WorkbooksEnum.COMPANY]: {
        name: 'Empresa',
        id: workbooks_enum_1.WorkbooksEnum.COMPANY,
        sheets: companyUniqueSheet_constant_1.companyUniqueSheetConstant,
    },
    [workbooks_enum_1.WorkbooksEnum.EPI]: {
        name: 'EPI',
        id: workbooks_enum_1.WorkbooksEnum.EPI,
        sheets: epiSheet_constant_1.epiSheetConstant,
        path: 'files/checklist/epi',
    },
    [workbooks_enum_1.WorkbooksEnum.EMPLOYEES]: {
        name: 'Empregados',
        id: workbooks_enum_1.WorkbooksEnum.EMPLOYEES,
        sheets: employeesSheet_constant_1.employeesSheetConstant,
        path: 'files/company/employees',
    },
    [workbooks_enum_1.WorkbooksEnum.HIERARCHIES]: {
        name: 'Organograma',
        id: workbooks_enum_1.WorkbooksEnum.HIERARCHIES,
        sheets: hierarchiesSheet_constant_1.hierarchiesSheetConstant,
        path: 'files/company/hierarchies',
    },
};
//# sourceMappingURL=workbooks.constant.js.map