"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyVariables = void 0;
const variables_enum_1 = require("../../enums/variables.enum");
const brazilian_utils_1 = require("@brazilian-utils/brazilian-utils");
const formats_1 = require("../../../../../../../shared/utils/formats");
const companyVariables = (company, workspace, address) => {
    var _a, _b, _c;
    const consultant = (_a = company.receivingServiceContracts[0]) === null || _a === void 0 ? void 0 : _a.applyingServiceCompany;
    return {
        [variables_enum_1.VariablesPGREnum.CONSULTANT_NAME]: consultant ? `${consultant.name} ` : `${company.name}`,
        [variables_enum_1.VariablesPGREnum.COMPANY_SIGNER_CITY]: consultant
            ? `${consultant.address.city} – ${consultant.address.state}`
            : `${company.address.city} – ${company.address.state}`,
        [variables_enum_1.VariablesPGREnum.COMPANY_CNAE]: (company === null || company === void 0 ? void 0 : company.primary_activity)
            ? `${(0, formats_1.formatCnae)(((_b = company === null || company === void 0 ? void 0 : company.primary_activity[0]) === null || _b === void 0 ? void 0 : _b.code) || '')} – ${((_c = company === null || company === void 0 ? void 0 : company.primary_activity[0]) === null || _c === void 0 ? void 0 : _c.name) || ''}`
            : '',
        [variables_enum_1.VariablesPGREnum.COMPANY_RISK_DEGREE]: (company === null || company === void 0 ? void 0 : company.primary_activity) && (company === null || company === void 0 ? void 0 : company.primary_activity[0]) ? String(company === null || company === void 0 ? void 0 : company.primary_activity[0].riskDegree) : '',
        [variables_enum_1.VariablesPGREnum.COMPANY_INITIAL]: `(${company === null || company === void 0 ? void 0 : company.initials})` || '',
        [variables_enum_1.VariablesPGREnum.COMPANY_CNPJ]: (0, brazilian_utils_1.formatCNPJ)(company === null || company === void 0 ? void 0 : company.cnpj) || '',
        [variables_enum_1.VariablesPGREnum.COMPANY_EMAIL]: (company === null || company === void 0 ? void 0 : company.email) || '',
        [variables_enum_1.VariablesPGREnum.COMPANY_NAME]: (company === null || company === void 0 ? void 0 : company.name) || '',
        [variables_enum_1.VariablesPGREnum.COMPANY_TELEPHONE]: (0, formats_1.formatPhoneNumber)(company === null || company === void 0 ? void 0 : company.phone) || '',
        [variables_enum_1.VariablesPGREnum.COMPANY_SHORT_NAME]: (company === null || company === void 0 ? void 0 : company.shortName) || (company === null || company === void 0 ? void 0 : company.name) || '',
        [variables_enum_1.VariablesPGREnum.COMPANY_WORK_TIME]: (company === null || company === void 0 ? void 0 : company.operationTime) || '',
        [variables_enum_1.VariablesPGREnum.COMPANY_NUMBER]: (address === null || address === void 0 ? void 0 : address.number) || '',
        [variables_enum_1.VariablesPGREnum.COMPANY_CEP]: (address === null || address === void 0 ? void 0 : address.cep) || '',
        [variables_enum_1.VariablesPGREnum.COMPANY_STATE]: (address === null || address === void 0 ? void 0 : address.state) || '',
        [variables_enum_1.VariablesPGREnum.COMPANY_STREET]: (address === null || address === void 0 ? void 0 : address.street) || '',
        [variables_enum_1.VariablesPGREnum.COMPANY_CITY]: (address === null || address === void 0 ? void 0 : address.city) || '',
        [variables_enum_1.VariablesPGREnum.COMPANY_NEIGHBOR]: (address === null || address === void 0 ? void 0 : address.neighborhood) || '',
        [variables_enum_1.VariablesPGREnum.COMPANY_MISSION]: (company === null || company === void 0 ? void 0 : company.mission) || '',
        [variables_enum_1.VariablesPGREnum.COMPANY_VISION]: (company === null || company === void 0 ? void 0 : company.vision) || '',
        [variables_enum_1.VariablesPGREnum.COMPANY_VALUES]: (company === null || company === void 0 ? void 0 : company.values) || '',
        [variables_enum_1.VariablesPGREnum.COMPANY_RESPONSIBLE]: (company === null || company === void 0 ? void 0 : company.responsibleName) || '',
        [variables_enum_1.VariablesPGREnum.WORKSPACE_CNPJ]: (0, brazilian_utils_1.formatCNPJ)(workspace === null || workspace === void 0 ? void 0 : workspace.cnpj) || (0, brazilian_utils_1.formatCNPJ)(company === null || company === void 0 ? void 0 : company.cnpj) || '',
        [variables_enum_1.VariablesPGREnum.IS_RS]: (address === null || address === void 0 ? void 0 : address.state) === 'RS' ? 'true' : '',
        [variables_enum_1.VariablesPGREnum.COMPANY_EMPLOYEES_TOTAL]: String(company === null || company === void 0 ? void 0 : company.employeeCount) || '',
    };
};
exports.companyVariables = companyVariables;
//# sourceMappingURL=company.variables.js.map