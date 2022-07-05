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
  return {
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
