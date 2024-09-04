import { getIsQuantity } from "@/@v2/shared/domain/functions/security/get-is-quantity.func"
import { getQuantityProbability } from "@/@v2/shared/domain/functions/security/get-quantity-probability.func"
import { RiskDataQuantityHeatVO } from "@/@v2/shared/domain/values-object/security/risk-data-quantity-heat.vo"
import { RiskDataQuantityNoiseVO } from "@/@v2/shared/domain/values-object/security/risk-data-quantity-noise.vo"
import { RiskDataQuantityQuiVO } from "@/@v2/shared/domain/values-object/security/risk-data-quantity-qui.vo"
import { RiskDataQuantityRadiationVO } from "@/@v2/shared/domain/values-object/security/risk-data-quantity-radiation.vo"
import { RiskDataQuantityVibrationFBVO } from "@/@v2/shared/domain/values-object/security/risk-data-quantity-vibration-fb.vo"
import { RiskDataQuantityVibrationLVO } from "@/@v2/shared/domain/values-object/security/risk-data-quantity-vibration-l.vo"
import { AdministrativeMeasureModel } from "./administrative-measure.model"
import { EgineeringMeasureModel } from "./engineering-measure.model"
import { EPIModel } from "./epis.model"
import { GenerateSourceModel } from "./generate-source.model"
import { RecommendationModel } from "./recommendation.model"
import { RiskModel } from "./risk.model"
import { ExamRiskModel } from "./exam-risk.model"

export type IRiskDataModel = {
  probability: number | null;
  probabilityAfter: number | null;

  risk: RiskModel
  recommendations: RecommendationModel[]
  administrativeMeasures: AdministrativeMeasureModel[]
  egineeringMeasures: EgineeringMeasureModel[]
  generateSources: GenerateSourceModel[]
  epis: EPIModel[]
  exams: ExamRiskModel[]

  quantityNoise: RiskDataQuantityNoiseVO | null
  quantityHeat: RiskDataQuantityHeatVO | null
  quantityRadiation: RiskDataQuantityRadiationVO | null
  quantityQui: RiskDataQuantityQuiVO | null
  quantityVibrationFB: RiskDataQuantityVibrationFBVO | null
  quantityVibrationL: RiskDataQuantityVibrationLVO | null
}

export class RiskDataModel {
  #probability: number;
  probabilityAfter: number;

  risk: RiskModel
  recommendations: RecommendationModel[]
  administrativeMeasures: AdministrativeMeasureModel[]
  egineeringMeasures: EgineeringMeasureModel[]
  generateSources: GenerateSourceModel[]
  epis: EPIModel[]
  exams: ExamRiskModel[]

  quantityNoise: RiskDataQuantityNoiseVO | null
  quantityHeat: RiskDataQuantityHeatVO | null
  quantityRadiation: RiskDataQuantityRadiationVO | null
  quantityQui: RiskDataQuantityQuiVO | null
  quantityVibrationFB: RiskDataQuantityVibrationFBVO | null
  quantityVibrationL: RiskDataQuantityVibrationLVO | null

  constructor(params: IRiskDataModel) {
    this.#probability = params.probability || 0
    this.probabilityAfter = params.probabilityAfter || 0

    this.risk = params.risk
    this.recommendations = params.recommendations
    this.administrativeMeasures = params.administrativeMeasures
    this.egineeringMeasures = params.egineeringMeasures
    this.generateSources = params.generateSources
    this.epis = params.epis
    this.exams = params.exams

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
    return getQuantityProbability({ ...this, probability: this.#probability })
  }
}