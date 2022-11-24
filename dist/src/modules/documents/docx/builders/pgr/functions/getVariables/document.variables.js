"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyVariables = void 0;
const variables_enum_1 = require("../../enums/variables.enum");
const companyVariables = (company) => {
    return {
        [variables_enum_1.VariablesPGREnum.COMPANY_EMAIL]: (company === null || company === void 0 ? void 0 : company.email) || '',
    };
};
exports.companyVariables = companyVariables;
//# sourceMappingURL=document.variables.js.map