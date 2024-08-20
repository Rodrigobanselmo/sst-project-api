import { RiskEntity } from "./risk.entity"

export type IRiskDataEntity = {
  risk: RiskEntity
}

export class RiskDataEntity {
  risk: RiskEntity

  constructor(params: IRiskDataEntity) {
    this.risk = params.risk
  }
}