import { HomoTypeEnum } from "@/@v2/shared/domain/enum/security/homo-type.enum";
import { RiskDataEntity } from "./risk-data.entity";

export type IHomogeneousGroupEntity = {
  name: string
  type: HomoTypeEnum;
  risksData: RiskDataEntity[]
}

export class HomogeneousGroupEntity {
  name: string
  type: HomoTypeEnum;
  risksData: RiskDataEntity[]

  constructor(params: IHomogeneousGroupEntity) {
    this.name = params.name
    this.type = params.type;
    this.risksData = params.risksData
  }
}