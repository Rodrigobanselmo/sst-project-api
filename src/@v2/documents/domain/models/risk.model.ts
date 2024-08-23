import { RiskTypeEnum } from "@/@v2/shared/domain/enum/security/risk-type.enum"

export type IRiskModel = {
  id: string
  name: string
  type: RiskTypeEnum
  isEmergency: boolean
}

export class RiskModel {
  id: string
  name: string
  type: RiskTypeEnum
  isEmergency: boolean

  constructor(params: IRiskModel) {
    this.id = params.id
    this.name = params.name
    this.type = params.type
    this.isEmergency = params.isEmergency
  }
}