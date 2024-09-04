import { getHomogeneuosVariablesDomain } from '@/@v2/documents/domain/functions/get-homogeneous-variables.func';
import { getRiskDataVariablesDomain } from '@/@v2/documents/domain/functions/get-risk-data-variables.func';
import { DocumentVersionModel } from '@/@v2/documents/domain/models/document-version.model';
import { HierarchyModel } from '@/@v2/documents/domain/models/hierarchy.model';
import { HomogeneousGroupModel } from '@/@v2/documents/domain/models/homogeneous-group.model';
import { VariablesPGREnum } from '../../enums/variables.enum';
import { IDocumentsRequirementKeys } from '@/@v2/shared/domain/types/document/document-types.type';

interface IBooleanVariables {
  documentVersion: DocumentVersionModel
  hierarchies: HierarchyModel[]
  homogeneousGroups: HomogeneousGroupModel[]
  documentType: IDocumentsRequirementKeys
}

export const booleanVariables = (document: IBooleanVariables) => {
  const risksData = document.homogeneousGroups.flatMap((group) => group.risksData({
    companyId: document.documentVersion.documentBase.company.id,
    documentType: document.documentType,
  }));
  const risksDataVariables = getRiskDataVariablesDomain(risksData);
  const homogeneousGroupsVariables = getHomogeneuosVariablesDomain({
    homogeneousGroups: document.homogeneousGroups,
    companyId: document.documentVersion.documentBase.company.id,
    documentType: document.documentType,
  });

  return {
    [VariablesPGREnum.IS_Q5]: document.documentVersion.documentBase.data.isQ5 ? 'true' : '',
    [VariablesPGREnum.HAS_RISK_FIS]: risksDataVariables.hasFis ? 'true' : '',
    [VariablesPGREnum.HAS_RISK_QUI]: risksDataVariables.hasQui ? 'true' : '',
    [VariablesPGREnum.HAS_RISK_BIO]: risksDataVariables.hasBio ? 'true' : '',
    [VariablesPGREnum.HAS_RISK_ERG]: risksDataVariables.hasErg ? 'true' : '',
    [VariablesPGREnum.HAS_RISK_ACI]: risksDataVariables.hasAci ? 'true' : '',
    [VariablesPGREnum.HAS_QUANTITY]: risksDataVariables.hasQuantity ? 'true' : '',
    [VariablesPGREnum.HAS_QUANTITY_NOISE]: risksDataVariables.hasQuantityNoise ? 'true' : '',
    [VariablesPGREnum.HAS_QUANTITY_QUI]: risksDataVariables.hasQuantityQui ? 'true' : '',
    [VariablesPGREnum.HAS_QUANTITY_VFB]: risksDataVariables.hasQuantityVibrationFB ? 'true' : '',
    [VariablesPGREnum.HAS_QUANTITY_VL]: risksDataVariables.hasQuantityVibrationL ? 'true' : '',
    [VariablesPGREnum.HAS_QUANTITY_RAD]: risksDataVariables.hasQuantityRadiation ? 'true' : '',
    [VariablesPGREnum.HAS_QUANTITY_HEAT]: risksDataVariables.hasQuantityHeat ? 'true' : '',
    [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_RISK]: homogeneousGroupsVariables.hasEnviromentRisk ? 'true' : '',
    [VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_RISK]: homogeneousGroupsVariables.hasCharacterizationRisk ? 'true' : '',
    [VariablesPGREnum.COMPANY_HAS_HIERARCHY_RISK]: homogeneousGroupsVariables.hasCharacterizationRisk ? 'true' : '',
    [VariablesPGREnum.COMPANY_HAS_GSE_RISK]: homogeneousGroupsVariables.hasGHORisk ? 'true' : '',
    [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_GENERAL]: homogeneousGroupsVariables.hasEnviromentGeneral ? 'true' : '',
    [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_ADM]: homogeneousGroupsVariables.hasEnviromentAdministrative ? 'true' : '',
    [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_OP]: homogeneousGroupsVariables.hasEnviromentOperation ? 'true' : '',
    [VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_SUP]: homogeneousGroupsVariables.hasEnviromentSupport ? 'true' : '',
    [VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_ACT]: homogeneousGroupsVariables.hasCharacterizationActivity ? 'true' : '',
    [VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_EQUIP]: homogeneousGroupsVariables.hasCharacterizationEquipment ? 'true' : '',
    [VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_WORK]: homogeneousGroupsVariables.hasCharacterizationWorkstation ? 'true' : '',
    [VariablesPGREnum.HAS_HEAT]: risksDataVariables.hasHeat ? 'true' : '',
    [VariablesPGREnum.HAS_VFB]: risksDataVariables.hasVibrationFB ? 'true' : '',
    [VariablesPGREnum.HAS_VL]: risksDataVariables.hasVibrationL ? 'true' : '',
    [VariablesPGREnum.HAS_EMERGENCY]: risksDataVariables.isEmergency ? 'true' : '',
    [VariablesPGREnum.IS_WORKSPACE_OWNER]: document.documentVersion.documentBase.workspace.isOwner ? 'true' : '',
    [VariablesPGREnum.IS_NOT_WORKSPACE_OWNER]: !document.documentVersion.documentBase.workspace.isOwner ? 'true' : '',
    [VariablesPGREnum.HAS_EMERGENCY_PLAN]: document.documentVersion.documentBase.data.hasEmergencyPlan ? 'true' : '',
  };
};
