import { DocumentDataPGRDto } from './../../../../../../sst/dto/document-data-pgr.dto';
import { DocumentDataEntity } from './../../../../../../sst/entities/documentData.entity';
import { IRiskDataJson, QuantityTypeEnum } from './../../../../../../company/interfaces/risk-data-json.types';
import { WorkspaceEntity } from './../../../../../../company/entities/workspace.entity';
import { RiskFactorGroupDataEntity } from '../../../../../../sst/entities/riskGroupData.entity';
import { HierarchyMapData } from './../../../../converter/hierarchy.converter';
import { CompanyModel } from '../../../../../../company/entities/company.entity';
import { VariablesPGREnum } from '../../enums/variables.enum';
import { CharacterizationTypeEnum, RiskFactorsEnum } from '@prisma/client';
import { filterRisk } from './../../../../../../../shared/utils/filterRisk';
import { DocumentVersionModel } from '@/@v2/documents/domain/models/document-version.model';
import { HierarchyModel } from '@/@v2/documents/domain/models/hierarchy.model';
import { HomogeneousGroupModel } from '@/@v2/documents/domain/models/homogeneous-group.model';
import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';

interface IDocumentBuildPGR {
  documentVersion: DocumentVersionModel
  hierarchies: HierarchyModel[]
  homogeneousGroups: HomogeneousGroupModel[]
}

export const booleanVariables = (document: IDocumentBuildPGR) => {
  const riskData = (document.data || []).filter((v) => filterRisk(v));

  return {
    [VariablesPGREnum.IS_Q5]: document.documentVersion.documentBase.data.isQ5 ? 'true' : '',
    [VariablesPGREnum.HAS_RISK_FIS]: document.homogeneousGroups.find((group) => group.risksData.find((riskData) => riskData.risk.type === RiskTypeEnum.FIS)) ? 'true' : '',
    [VariablesPGREnum.HAS_RISK_QUI]: document.homogeneousGroups.find((group) => group.risksData.find((riskData) => riskData.risk.type === RiskTypeEnum.QUI)) ? 'true' : '',
    [VariablesPGREnum.HAS_RISK_BIO]: document.homogeneousGroups.find((group) => group.risksData.find((riskData) => riskData.risk.type === RiskTypeEnum.BIO)) ? 'true' : '',
    [VariablesPGREnum.HAS_RISK_ERG]: document.homogeneousGroups.find((group) => group.risksData.find((riskData) => riskData.risk.type === RiskTypeEnum.ERG)) ? 'true' : '',
    [VariablesPGREnum.HAS_RISK_ACI]: document.homogeneousGroups.find((group) => group.risksData.find((riskData) => riskData.risk.type === RiskTypeEnum.ACI)) ? 'true' : '',
    [VariablesPGREnum.HAS_QUANTITY]: document.homogeneousGroups.find((group) => group.risksData.find((riskData) => riskData.isQuantity)) ? 'true' : '',
    [VariablesPGREnum.HAS_QUANTITY_NOISE]: (document.data || []).find(
      (riskData) =>
        riskData.json &&
        riskData.isQuantity &&
        (riskData.json as unknown as IRiskDataJson).type === QuantityTypeEnum.NOISE,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.HAS_QUANTITY_QUI]: (document.data || []).find(
      (riskData) =>
        riskData.json &&
        riskData.isQuantity &&
        (riskData.json as unknown as IRiskDataJson).type === QuantityTypeEnum.QUI,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.HAS_QUANTITY_VFB]: (document.data || []).find(
      (riskData) =>
        riskData.json &&
        riskData.isQuantity &&
        (riskData.json as unknown as IRiskDataJson).type === QuantityTypeEnum.VFB,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.HAS_QUANTITY_VL]: (document.data || []).find(
      (riskData) =>
        riskData.json &&
        riskData.isQuantity &&
        (riskData.json as unknown as IRiskDataJson).type === QuantityTypeEnum.VL,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.HAS_QUANTITY_RAD]: (document.data || []).find(
      (riskData) =>
        riskData.json &&
        riskData.isQuantity &&
        (riskData.json as unknown as IRiskDataJson).type === QuantityTypeEnum.RADIATION,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.HAS_QUANTITY_HEAT]: (document.data || []).find(
      (riskData) =>
        riskData.json &&
        riskData.isQuantity &&
        (riskData.json as unknown as IRiskDataJson).type === QuantityTypeEnum.HEAT,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_RISK]: riskData.find((riskData) => riskData.homogeneousGroup.environment)
      ? 'true'
      : '',
    [VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_RISK]: riskData.find(
      (riskData) => riskData.homogeneousGroup.characterization,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.COMPANY_HAS_HIERARCHY_RISK]: riskData.find(
      (riskData) => riskData.homogeneousGroup.type === 'HIERARCHY',
    )
      ? 'true'
      : '',
    [VariablesPGREnum.COMPANY_HAS_GSE_RISK]: riskData.find((riskData) => !riskData.homogeneousGroup.type) ? 'true' : '',
    [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_GENERAL]: company.environments.find(
      (env) => env.type === CharacterizationTypeEnum.GENERAL,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_ADM]: company.environments.find(
      (env) => env.type === CharacterizationTypeEnum.ADMINISTRATIVE,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_OP]: company.environments.find(
      (env) => env.type === CharacterizationTypeEnum.OPERATION,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_SUP]: company.environments.find(
      (env) => env.type === CharacterizationTypeEnum.SUPPORT,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_ACT]: company.characterization.find(
      (env) => env.type === CharacterizationTypeEnum.ACTIVITIES,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_EQUIP]: company.characterization.find(
      (env) => env.type === CharacterizationTypeEnum.EQUIPMENT,
    )
      ? 'true'
      : '',
    [VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_WORK]: company.characterization.find(
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
    [VariablesPGREnum.HAS_EMERGENCY_PLAN]: document.hasEmergencyPlan ? 'true' : '',
  };
};
