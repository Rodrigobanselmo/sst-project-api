import { HomoTypeEnum } from "@/@v2/shared/domain/enum/security/homo-type.enum";
import { RiskDataModel } from "./risk-data.model";
import { ICharacterizationModel } from "./characterization.model";
import { getCharacterizationType } from "@/@v2/shared/domain/functions/security/get-characterization-type.func";
import { getIsHomogeneousGroupGHO } from "@/@v2/shared/domain/functions/security/get-is-homogeneous-group-gho.func";
import { getIsHomogeneousGroupHierarchy } from "@/@v2/shared/domain/functions/security/get-is-homogeneous-group-hierarchy.func";

export type IHomogeneousGroupModel = {
  id: string
  name: string
  type: HomoTypeEnum;

  characterization: ICharacterizationModel | null
  risksData: RiskDataModel[]
}

export class HomogeneousGroupModel {
  id: string
  name: string
  type: HomoTypeEnum;

  characterization: ICharacterizationModel | null
  risksData: RiskDataModel[]

  constructor(params: IHomogeneousGroupModel) {
    this.id = params.id
    this.name = params.name
    this.type = params.type;
    this.risksData = params.risksData
    this.characterization = params.characterization
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

}