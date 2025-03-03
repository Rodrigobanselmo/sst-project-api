import { IRiskProbabilityValues } from "../../types/security/risk-probability-values.type"
import { RiskDataQuantityHeatVO } from "../../values-object/security/risk-data-quantity-heat.vo"
import { RiskDataQuantityNoiseVO } from "../../values-object/security/risk-data-quantity-noise.vo"
import { RiskDataQuantityQuiVO } from "../../values-object/security/risk-data-quantity-qui.vo"
import { RiskDataQuantityRadiationVO } from "../../values-object/security/risk-data-quantity-radiation.vo"
import { RiskDataQuantityVibrationFBVO } from "../../values-object/security/risk-data-quantity-vibration-fb.vo"
import { RiskDataQuantityVibrationLVO } from "../../values-object/security/risk-data-quantity-vibration-l.vo"

interface IValuesCheckParams {
  quantityNoise: RiskDataQuantityNoiseVO | null
  quantityHeat: RiskDataQuantityHeatVO | null
  quantityRadiation: RiskDataQuantityRadiationVO | null
  quantityQui: RiskDataQuantityQuiVO | null
  quantityVibrationFB: RiskDataQuantityVibrationFBVO | null
  quantityVibrationL: RiskDataQuantityVibrationLVO | null
}

export function getQuantityProbability({ quantityHeat, quantityNoise, quantityQui, quantityRadiation, quantityVibrationFB, quantityVibrationL }: IValuesCheckParams): IRiskProbabilityValues {
  const highProbability = Math.max(
    quantityNoise?.probability || 0,
    quantityHeat?.probability || 0,
    quantityRadiation?.probability || 0,
    quantityQui?.probability || 0,
    quantityVibrationFB?.probability || 0,
    quantityVibrationL?.probability || 0
  ) || 0

  return highProbability as IRiskProbabilityValues
}