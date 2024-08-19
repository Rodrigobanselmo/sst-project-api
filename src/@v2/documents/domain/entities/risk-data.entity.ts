import { RiskEntity } from "./risk.entity"

export type IRiskDataEntity = {
  name: string
  risk: RiskEntity
}

export class RiskDataEntity {
  name: string
  risk: RiskEntity

  constructor(params: IRiskDataEntity) {
    this.name = params.name
    this.risk = params.risk
  }
}