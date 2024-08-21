import { HomoTypeEnum } from "@/@v2/shared/domain/enum/security/homo-type.enum";
import { RiskDataModel } from "./risk-data.model";

export type IHomogeneousGroupModel = {
  id: string
  name: string
  type: HomoTypeEnum;
  risksData: RiskDataModel[]
}

export class HomogeneousGroupModel {
  id: string
  name: string
  type: HomoTypeEnum;
  risksData: RiskDataModel[]

  constructor(params: IHomogeneousGroupModel) {
    this.id = params.id
    this.name = params.name
    this.type = params.type;
    this.risksData = params.risksData
  }
}