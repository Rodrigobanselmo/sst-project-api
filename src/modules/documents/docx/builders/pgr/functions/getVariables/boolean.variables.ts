import {
  IRiskDataJson,
  QuantityTypeEnum,
} from './../../../../../../company/interfaces/risk-data-json.types';
import { WorkspaceEntity } from './../../../../../../company/entities/workspace.entity';
import { RiskFactorGroupDataEntity } from './../../../../../../checklist/entities/riskGroupData.entity';
import { HierarchyMapData } from './../../../../converter/hierarchy.converter';
import { CompanyEntity } from '../../../../../../company/entities/company.entity';
import { VariablesPGREnum } from '../../enums/variables.enum';
import {
  CharacterizationTypeEnum,
  CompanyEnvironmentTypesEnum,
  RiskFactorsEnum,
} from '@prisma/client';

export const booleanVariables = (
  company: CompanyEntity,
  workspace: WorkspaceEntity,
  hierarchy: Map<string, HierarchyMapData>,
  document: RiskFactorGroupDataEntity,
) => {
  console.log(
    (document.data || []).find(
      (riskData) => riskData.riskFactor.type == RiskFactorsEnum.ACI,
    ),
  );
  return {
    [VariablesPGREnum.IS_Q5]: document.isQ5 ? 'true' : '',
    [VariablesPGREnum.HAS_RISK_FIS]: (document.data || []).find(
      (riskData) => riskData.riskFactor.type == RiskFactorsEnum.FIS,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.HAS_RISK_QUI]: (document.data || []).find(
      (riskData) => riskData.riskFactor.type == RiskFactorsEnum.QUI,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.HAS_RISK_BIO]: (document.data || []).find(
      (riskData) => riskData.riskFactor.type == RiskFactorsEnum.BIO,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.HAS_RISK_ERG]: (document.data || []).find(
      (riskData) => riskData.riskFactor.type == RiskFactorsEnum.ERG,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.HAS_RISK_ACI]: (document.data || []).find(
      (riskData) => riskData.riskFactor.type == RiskFactorsEnum.ACI,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.HAS_QUANTITY]: (document.data || []).find(
      (riskData) => riskData.isQuantity,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.HAS_QUANTITY_NOISE]: (document.data || []).find(
      (riskData) =>
        riskData.json &&
        riskData.isQuantity &&
        (riskData.json as unknown as IRiskDataJson).type ===
          QuantityTypeEnum.NOISE,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.HAS_QUANTITY_QUI]: (document.data || []).find(
      (riskData) =>
        riskData.json &&
        riskData.isQuantity &&
        (riskData.json as unknown as IRiskDataJson).type ===
          QuantityTypeEnum.QUI,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.HAS_QUANTITY_VFB]: (document.data || []).find(
      (riskData) =>
        riskData.json &&
        riskData.isQuantity &&
        (riskData.json as unknown as IRiskDataJson).type ===
          QuantityTypeEnum.VFB,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.HAS_QUANTITY_VL]: (document.data || []).find(
      (riskData) =>
        riskData.json &&
        riskData.isQuantity &&
        (riskData.json as unknown as IRiskDataJson).type ===
          QuantityTypeEnum.VL,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.HAS_QUANTITY_RAD]: (document.data || []).find(
      (riskData) =>
        riskData.json &&
        riskData.isQuantity &&
        (riskData.json as unknown as IRiskDataJson).type ===
          QuantityTypeEnum.RADIATION,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.HAS_QUANTITY_HEAT]: (document.data || []).find(
      (riskData) =>
        riskData.json &&
        riskData.isQuantity &&
        (riskData.json as unknown as IRiskDataJson).type ===
          QuantityTypeEnum.HEAT,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_RISK]: (document.data || []).find(
      (riskData) => riskData.homogeneousGroup.environment,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_RISK]: (
      document.data || []
    ).find((riskData) => riskData.homogeneousGroup.characterization)
      ? 'true'
      : '',
    [VariablesPGREnum.COMPANY_HAS_HIERARCHY_RISK]: (document.data || []).find(
      (riskData) => riskData.homogeneousGroup.type === 'HIERARCHY',
    )
      ? 'true'
      : '',
    [VariablesPGREnum.COMPANY_HAS_GSE_RISK]: (document.data || []).find(
      (riskData) => !riskData.homogeneousGroup.type,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_GENERAL]:
      company.environments.find(
        (env) => env.type === CompanyEnvironmentTypesEnum.GENERAL,
      )
        ? 'true'
        : '',
    [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_ADM]: company.environments.find(
      (env) => env.type === CompanyEnvironmentTypesEnum.ADMINISTRATIVE,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_OP]: company.environments.find(
      (env) => env.type === CompanyEnvironmentTypesEnum.OPERATION,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_SUP]: company.environments.find(
      (env) => env.type === CompanyEnvironmentTypesEnum.SUPPORT,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_ACT]:
      company.characterization.find(
        (env) => env.type === CharacterizationTypeEnum.ACTIVITIES,
      )
        ? 'true'
        : '',
    [VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_EQUIP]:
      company.characterization.find(
        (env) => env.type === CharacterizationTypeEnum.EQUIPMENT,
      )
        ? 'true'
        : '',
    [VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_WORK]:
      company.characterization.find(
        (env) => env.type === CharacterizationTypeEnum.WORKSTATION,
      )
        ? 'true'
        : '',
    [VariablesPGREnum.HAS_HEAT]: (document?.data || []).find(
      (riskData) =>
        (riskData.riskId === 'fda7e05a-0f90-4720-8429-c44a56109411' ||
          riskData.riskFactor.name === 'Temperaturas anormais (calor)') &&
        riskData.riskFactor.type === RiskFactorsEnum.FIS,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.HAS_VFB]: (document?.data || []).find(
      (riskData) =>
        (riskData.riskId === 'd6c59841-9e2e-4a59-b069-86c28ae05507' ||
          riskData.riskFactor.name === 'Vibrações de Corpo Inteiro') &&
        riskData.riskFactor.type === RiskFactorsEnum.FIS,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.HAS_VL]: (document?.data || []).find(
      (riskData) =>
        (riskData.riskId === '0fc5e0d1-b455-4b77-a583-9a6170ecc2a9' ||
          riskData.riskFactor.name === 'Vibrações Localizadas (Mão-Braço)') &&
        riskData.riskFactor.type === RiskFactorsEnum.FIS,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.HAS_EMERGENCY]: (document?.data || []).some(
      (riskData) => riskData.riskFactor && riskData.riskFactor.isEmergency,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.IS_WORKSPACE_OWNER]: workspace.isOwner ? 'true' : '',
    [VariablesPGREnum.IS_NOT_WORKSPACE_OWNER]: !workspace.isOwner ? 'true' : '',
  };
};
