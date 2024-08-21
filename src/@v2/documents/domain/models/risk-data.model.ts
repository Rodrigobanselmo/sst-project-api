import { RiskDataQuantityHeatVO } from "@/@v2/shared/domain/values-object/security/risk-data-quantity-heat.vo"
import { RiskDataQuantityNoiseVO } from "@/@v2/shared/domain/values-object/security/risk-data-quantity-noise.vo"
import { RiskDataQuantityQuiVO } from "@/@v2/shared/domain/values-object/security/risk-data-quantity-qui.vo"
import { RiskDataQuantityRadiationVO } from "@/@v2/shared/domain/values-object/security/risk-data-quantity-radiation.vo"
import { RiskDataQuantityVibrationFBVO } from "@/@v2/shared/domain/values-object/security/risk-data-quantity-vibration-fb.vo"
import { RiskModel } from "./risk.model"
import { getQuantityProbability } from "@/@v2/shared/domain/functions/security/get-quantity-probability.func"
import { getIsQuantity } from "@/@v2/shared/domain/functions/security/get-is-quantity.func"
import { RiskDataQuantityVibrationLVO } from "@/@v2/shared/domain/values-object/security/risk-data-quantity-vibration-l.vo"

export type IRiskDataModel = {
  risk: RiskModel

  quantityNoise: RiskDataQuantityNoiseVO | null
  quantityHeat: RiskDataQuantityHeatVO | null
  quantityRadiation: RiskDataQuantityRadiationVO | null
  quantityQui: RiskDataQuantityQuiVO | null
  quantityVibrationFB: RiskDataQuantityVibrationFBVO | null
  quantityVibrationL: RiskDataQuantityVibrationLVO | null
}

export class RiskDataModel {
  risk: RiskModel

  quantityNoise: RiskDataQuantityNoiseVO | null
  quantityHeat: RiskDataQuantityHeatVO | null
  quantityRadiation: RiskDataQuantityRadiationVO | null
  quantityQui: RiskDataQuantityQuiVO | null
  quantityVibrationFB: RiskDataQuantityVibrationFBVO | null
  quantityVibrationL: RiskDataQuantityVibrationLVO | null

  constructor(params: IRiskDataModel) {
    this.risk = params.risk

    this.quantityNoise = params.quantityNoise
    this.quantityHeat = params.quantityHeat
    this.quantityRadiation = params.quantityRadiation
    this.quantityQui = params.quantityQui
    this.quantityVibrationFB = params.quantityVibrationFB
    this.quantityVibrationL = params.quantityVibrationL
  }

  get isQuantity() {
    return getIsQuantity(this)
  }

  get probability() {
    return getQuantityProbability(this)
  }
}