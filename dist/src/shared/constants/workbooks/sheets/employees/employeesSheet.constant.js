"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeesSheetConstant = void 0;
const employeesColumns_constant_1 = require("./employeesColumns.constant");
const employees_enum_1 = require("./employees.enum");
exports.employeesSheetConstant = {
    [employees_enum_1.EmployeesUniqueSheetEnum.EMPLOYEES]: {
        name: 'Empregados',
        id: employees_enum_1.EmployeesUniqueSheetEnum.EMPLOYEES,
        columns: employeesColumns_constant_1.employeesColumnsConstant,
    },
};
//# sourceMappingURL=employeesSheet.constant.js.map