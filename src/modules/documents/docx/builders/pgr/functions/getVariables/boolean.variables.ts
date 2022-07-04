import { HierarchyMapData } from './../../../../converter/hierarchy.converter';
import { CompanyEntity } from '../../../../../../company/entities/company.entity';
import { VariablesPGREnum } from '../../enums/variables.enum';
import {
  CharacterizationTypeEnum,
  CompanyEnvironmentTypesEnum,
} from '@prisma/client';

export const booleanVariables = (
  company: CompanyEntity,
  hierarchy: Map<string, HierarchyMapData>,
) => {
  return {
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
  };
};
