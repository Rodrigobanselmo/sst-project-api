import { HomoTypeEnum } from "@/@v2/shared/domain/enum/security/homo-type.enum";
import { RiskDataEntity } from "./risk-data.entity";

export type IHomogeneousGroupEntity = {
  id: string
  name: string
  type: HomoTypeEnum;
  risksData: RiskDataEntity[]
}

export class HomogeneousGroupEntity {
  id: string
  name: string
  type: HomoTypeEnum;
  risksData: RiskDataEntity[]

  constructor(params: IHomogeneousGroupEntity) {
    this.id = params.id
    this.name = params.name
    this.type = params.type;
    this.risksData = params.risksData
  }
}