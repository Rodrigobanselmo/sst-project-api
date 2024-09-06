import { HomoTypeEnum } from "@/@v2/shared/domain/enum/security/homo-type.enum";
import { getCharacterizationType } from "@/@v2/shared/domain/functions/security/get-characterization-type.func";
import { getIsHomogeneousGroupGHO } from "@/@v2/shared/domain/functions/security/get-is-homogeneous-group-gho.func";
import { getIsHomogeneousGroupHierarchy } from "@/@v2/shared/domain/functions/security/get-is-homogeneous-group-hierarchy.func";
import { getRiskDocumentsRequirements } from "@/@v2/shared/domain/functions/document/get-risk-document-requirements.func";
import { ICharacterizationModel } from "./characterization.model";
import { HierarchyGroupModel } from "./hierarchy-groups.model";
import { RiskDataModel } from "./risk-data.model";
import { IDocumentsRequirementKeys } from "@/@v2/shared/domain/types/document/document-types.type";

export type IHomogeneousGroupModel = {
  id: string
  name: string
  description: string
  type: HomoTypeEnum;
  companyId: string
  documentType: IDocumentsRequirementKeys

  hierarchies: HierarchyGroupModel[]
  characterization: ICharacterizationModel | null
  risksData: RiskDataModel[]
}

export class HomogeneousGroupModel {
  id: string
  name: string
  description: string
  type: HomoTypeEnum;

  hierarchies: HierarchyGroupModel[]
  characterization: ICharacterizationModel | null
  risksData: RiskDataModel[]

  constructor(params: IHomogeneousGroupModel) {
    this.id = params.id
    this.name = params.name
    this.description = params.description
    this.type = params.type;

    this.hierarchies = params.hierarchies
    this.characterization = params.characterization

    this.risksData = this.filterRisksData({
      companyId: params.companyId,
      documentType: params.documentType,
      risksData: params.risksData
    })
  }

  get isEnviroment() {
    if (!this.characterization) return false
    return getCharacterizationType(this.characterization.type).isEnviroment
  }

  get isCharacterization() {
    if (!this.characterization) return false
    return getCharacterizationType(this.characterization.type).isCharacterization
  }

  get isHierarchy() {
    return getIsHomogeneousGroupHierarchy(this)
  }

  get isGHO() {
    return getIsHomogeneousGroupGHO(this)
  }

  private filterRisksData({ companyId, documentType, risksData }: { companyId: string, documentType: IDocumentsRequirementKeys; risksData: RiskDataModel[] }) {
    return risksData.filter(riskData => {
      const { checkIfExistAny } = getRiskDocumentsRequirements({ companyId, requirements: riskData.risk.documentsRequirements })
      return checkIfExistAny({ documentType })
    })
  }
}