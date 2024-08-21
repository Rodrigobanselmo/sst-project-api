import { RiskDataQuantityHeatVO } from "../../values-object/security/risk-data-quantity-heat.vo"
import { RiskDataQuantityNoiseVO } from "../../values-object/security/risk-data-quantity-noise.vo"
import { RiskDataQuantityQuiVO } from "../../values-object/security/risk-data-quantity-qui.vo"
import { RiskDataQuantityRadiationVO } from "../../values-object/security/risk-data-quantity-radiation.vo"
import { RiskDataQuantityVibrationFBVO } from "../../values-object/security/risk-data-quantity-vibration-fb.vo"
import { RiskDataQuantityVibrationLVO } from "../../values-object/security/risk-data-quantity-vibration-l.vo"
import { getQuantityProbability } from "./get-quantity-probability.func"

interface IValuesCheckParams {
  quantityNoise: RiskDataQuantityNoiseVO | null
  quantityHeat: RiskDataQuantityHeatVO | null
  quantityRadiation: RiskDataQuantityRadiationVO | null
  quantityQui: RiskDataQuantityQuiVO | null
  quantityVibrationFB: RiskDataQuantityVibrationFBVO | null
  quantityVibrationL: RiskDataQuantityVibrationLVO | null
}

export function getIsQuantity(params: IValuesCheckParams) {
  return !!getQuantityProbability(params)
}