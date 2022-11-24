"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.booleanVariables = void 0;
const risk_data_json_types_1 = require("./../../../../../../company/interfaces/risk-data-json.types");
const variables_enum_1 = require("../../enums/variables.enum");
const client_1 = require("@prisma/client");
const booleanVariables = (company, workspace, hierarchy, document) => {
    return {
        [variables_enum_1.VariablesPGREnum.IS_Q5]: document.isQ5 ? 'true' : '',
        [variables_enum_1.VariablesPGREnum.HAS_RISK_FIS]: (document.data || []).find((riskData) => riskData.riskFactor.type == client_1.RiskFactorsEnum.FIS) ? 'true' : '',
        [variables_enum_1.VariablesPGREnum.HAS_RISK_QUI]: (document.data || []).find((riskData) => riskData.riskFactor.type == client_1.RiskFactorsEnum.QUI) ? 'true' : '',
        [variables_enum_1.VariablesPGREnum.HAS_RISK_BIO]: (document.data || []).find((riskData) => riskData.riskFactor.type == client_1.RiskFactorsEnum.BIO) ? 'true' : '',
        [variables_enum_1.VariablesPGREnum.HAS_RISK_ERG]: (document.data || []).find((riskData) => riskData.riskFactor.type == client_1.RiskFactorsEnum.ERG) ? 'true' : '',
        [variables_enum_1.VariablesPGREnum.HAS_RISK_ACI]: (document.data || []).find((riskData) => riskData.riskFactor.type == client_1.RiskFactorsEnum.ACI) ? 'true' : '',
        [variables_enum_1.VariablesPGREnum.HAS_QUANTITY]: (document.data || []).find((riskData) => riskData.isQuantity) ? 'true' : '',
        [variables_enum_1.VariablesPGREnum.HAS_QUANTITY_NOISE]: (document.data || []).find((riskData) => riskData.json && riskData.isQuantity && riskData.json.type === risk_data_json_types_1.QuantityTypeEnum.NOISE)
            ? 'true'
            : '',
        [variables_enum_1.VariablesPGREnum.HAS_QUANTITY_QUI]: (document.data || []).find((riskData) => riskData.json && riskData.isQuantity && riskData.json.type === risk_data_json_types_1.QuantityTypeEnum.QUI)
            ? 'true'
            : '',
        [variables_enum_1.VariablesPGREnum.HAS_QUANTITY_VFB]: (document.data || []).find((riskData) => riskData.json && riskData.isQuantity && riskData.json.type === risk_data_json_types_1.QuantityTypeEnum.VFB)
            ? 'true'
            : '',
        [variables_enum_1.VariablesPGREnum.HAS_QUANTITY_VL]: (document.data || []).find((riskData) => riskData.json && riskData.isQuantity && riskData.json.type === risk_data_json_types_1.QuantityTypeEnum.VL)
            ? 'true'
            : '',
        [variables_enum_1.VariablesPGREnum.HAS_QUANTITY_RAD]: (document.data || []).find((riskData) => riskData.json && riskData.isQuantity && riskData.json.type === risk_data_json_types_1.QuantityTypeEnum.RADIATION)
            ? 'true'
            : '',
        [variables_enum_1.VariablesPGREnum.HAS_QUANTITY_HEAT]: (document.data || []).find((riskData) => riskData.json && riskData.isQuantity && riskData.json.type === risk_data_json_types_1.QuantityTypeEnum.HEAT)
            ? 'true'
            : '',
        [variables_enum_1.VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_RISK]: (document.data || []).find((riskData) => riskData.homogeneousGroup.environment) ? 'true' : '',
        [variables_enum_1.VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_RISK]: (document.data || []).find((riskData) => riskData.homogeneousGroup.characterization) ? 'true' : '',
        [variables_enum_1.VariablesPGREnum.COMPANY_HAS_HIERARCHY_RISK]: (document.data || []).find((riskData) => riskData.homogeneousGroup.type === 'HIERARCHY') ? 'true' : '',
        [variables_enum_1.VariablesPGREnum.COMPANY_HAS_GSE_RISK]: (document.data || []).find((riskData) => !riskData.homogeneousGroup.type) ? 'true' : '',
        [variables_enum_1.VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_GENERAL]: company.environments.find((env) => env.type === client_1.CharacterizationTypeEnum.GENERAL) ? 'true' : '',
        [variables_enum_1.VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_ADM]: company.environments.find((env) => env.type === client_1.CharacterizationTypeEnum.ADMINISTRATIVE) ? 'true' : '',
        [variables_enum_1.VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_OP]: company.environments.find((env) => env.type === client_1.CharacterizationTypeEnum.OPERATION) ? 'true' : '',
        [variables_enum_1.VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_SUP]: company.environments.find((env) => env.type === client_1.CharacterizationTypeEnum.SUPPORT) ? 'true' : '',
        [variables_enum_1.VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_ACT]: company.characterization.find((env) => env.type === client_1.CharacterizationTypeEnum.ACTIVITIES) ? 'true' : '',
        [variables_enum_1.VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_EQUIP]: company.characterization.find((env) => env.type === client_1.CharacterizationTypeEnum.EQUIPMENT) ? 'true' : '',
        [variables_enum_1.VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_WORK]: company.characterization.find((env) => env.type === client_1.CharacterizationTypeEnum.WORKSTATION) ? 'true' : '',
        [variables_enum_1.VariablesPGREnum.HAS_HEAT]: ((document === null || document === void 0 ? void 0 : document.data) || []).find((riskData) => (riskData.riskId === 'fda7e05a-0f90-4720-8429-c44a56109411' || riskData.riskFactor.name === 'Temperaturas anormais (calor)') &&
            riskData.riskFactor.type === client_1.RiskFactorsEnum.FIS)
            ? 'true'
            : '',
        [variables_enum_1.VariablesPGREnum.HAS_VFB]: ((document === null || document === void 0 ? void 0 : document.data) || []).find((riskData) => (riskData.riskId === 'd6c59841-9e2e-4a59-b069-86c28ae05507' || riskData.riskFactor.name === 'Vibrações de Corpo Inteiro') &&
            riskData.riskFactor.type === client_1.RiskFactorsEnum.FIS)
            ? 'true'
            : '',
        [variables_enum_1.VariablesPGREnum.HAS_VL]: ((document === null || document === void 0 ? void 0 : document.data) || []).find((riskData) => (riskData.riskId === '0fc5e0d1-b455-4b77-a583-9a6170ecc2a9' || riskData.riskFactor.name === 'Vibrações Localizadas (Mão-Braço)') &&
            riskData.riskFactor.type === client_1.RiskFactorsEnum.FIS)
            ? 'true'
            : '',
        [variables_enum_1.VariablesPGREnum.HAS_EMERGENCY]: ((document === null || document === void 0 ? void 0 : document.data) || []).some((riskData) => riskData.riskFactor && riskData.riskFactor.isEmergency) ? 'true' : '',
        [variables_enum_1.VariablesPGREnum.IS_WORKSPACE_OWNER]: workspace.isOwner ? 'true' : '',
        [variables_enum_1.VariablesPGREnum.IS_NOT_WORKSPACE_OWNER]: !workspace.isOwner ? 'true' : '',
        [variables_enum_1.VariablesPGREnum.HAS_EMERGENCY_PLAN]: document.hasEmergencyPlan ? 'true' : '',
    };
};
exports.booleanVariables = booleanVariables;
//# sourceMappingURL=boolean.variables.js.map