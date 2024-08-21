import { RiskTypeEnum } from "@/@v2/shared/domain/enum/security/risk-type.enum"

export type IRiskModel = {
  id: string
  name: string
  type: RiskTypeEnum
}

export class RiskModel {
  id: string
  name: string
  type: RiskTypeEnum

  constructor(params: IRiskModel) {
    this.id = params.id
    this.name = params.name
    this.type = params.type
  }
}