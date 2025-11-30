import { getIsQuantity } from '@/@v2/shared/domain/functions/security/get-is-quantity.func';
import { getQuantityProbability } from '@/@v2/shared/domain/functions/security/get-quantity-probability.func';
import { IRiskLevelValues } from '@/@v2/shared/domain/types/security/risk-level-values.type';
import { IRiskProbabilityValues } from '@/@v2/shared/domain/types/security/risk-probability-values.type';
import { RiskDataQuantityHeatVO } from '@/@v2/shared/domain/values-object/security/risk-data-quantity-heat.vo';
import { RiskDataQuantityNoiseVO } from '@/@v2/shared/domain/values-object/security/risk-data-quantity-noise.vo';
import { RiskDataQuantityQuiVO } from '@/@v2/shared/domain/values-object/security/risk-data-quantity-qui.vo';
import { RiskDataQuantityRadiationVO } from '@/@v2/shared/domain/values-object/security/risk-data-quantity-radiation.vo';
import { RiskDataQuantityVibrationFBVO } from '@/@v2/shared/domain/values-object/security/risk-data-quantity-vibration-fb.vo';
import { RiskDataQuantityVibrationLVO } from '@/@v2/shared/domain/values-object/security/risk-data-quantity-vibration-l.vo';
import { AdministrativeMeasureModel } from './administrative-measure.model';
import { EngineeringMeasureModel } from './engineering-measure.model';
import { EPIModel } from './epis.model';
import { ExamRiskModel } from './exam-risk.model';
import { GenerateSourceModel } from './generate-source.model';
import { RecommendationDataModel } from './recommendation-data.model';
import { RecommendationModel } from './recommendation.model';
import { RiskModel } from './risk.model';

export type IRiskDataActivity = {
  realActivity: string;
  activities: { description?: string; subActivity?: string }[];
};

export type IRiskDataModel = {
  probability: IRiskProbabilityValues | null;
  probabilityAfter: IRiskProbabilityValues | null;
  level: IRiskLevelValues | null;

  risk: RiskModel;
  recommendations: RecommendationModel[];
  administrativeMeasures: AdministrativeMeasureModel[];
  engineeringMeasures: EngineeringMeasureModel[];
  generateSources: GenerateSourceModel[];
  epis: EPIModel[];
  exams: ExamRiskModel[];
  recommendationsData: RecommendationDataModel[];

  quantityNoise: RiskDataQuantityNoiseVO | null;
  quantityHeat: RiskDataQuantityHeatVO | null;
  quantityRadiation: RiskDataQuantityRadiationVO | null;
  quantityQui: RiskDataQuantityQuiVO | null;
  quantityVibrationFB: RiskDataQuantityVibrationFBVO | null;
  quantityVibrationL: RiskDataQuantityVibrationLVO | null;

  activities: IRiskDataActivity;
};

export class RiskDataModel {
  #probability: IRiskProbabilityValues;
  probabilityAfter: number;
  level: IRiskLevelValues;

  risk: RiskModel;
  recommendations: RecommendationModel[];
  administrativeMeasures: AdministrativeMeasureModel[];
  engineeringMeasures: EngineeringMeasureModel[];
  generateSources: GenerateSourceModel[];
  epis: EPIModel[];
  exams: ExamRiskModel[];
  recommendationsData: RecommendationDataModel[];

  quantityNoise: RiskDataQuantityNoiseVO | null;
  quantityHeat: RiskDataQuantityHeatVO | null;
  quantityRadiation: RiskDataQuantityRadiationVO | null;
  quantityQui: RiskDataQuantityQuiVO | null;
  quantityVibrationFB: RiskDataQuantityVibrationFBVO | null;
  quantityVibrationL: RiskDataQuantityVibrationLVO | null;

  activities: IRiskDataActivity;

  constructor(params: IRiskDataModel) {
    this.#probability = params.probability || 0;
    this.probabilityAfter = params.probabilityAfter || 0;
    this.level = params.level || 1;

    this.risk = params.risk;
    this.recommendations = params.recommendations;
    this.administrativeMeasures = params.administrativeMeasures;
    this.engineeringMeasures = params.engineeringMeasures;
    this.generateSources = params.generateSources;
    this.epis = params.epis;
    this.exams = params.exams;
    this.recommendationsData = params.recommendationsData;

    this.quantityNoise = params.quantityNoise;
    this.quantityHeat = params.quantityHeat;
    this.quantityRadiation = params.quantityRadiation;
    this.quantityQui = params.quantityQui;
    this.quantityVibrationFB = params.quantityVibrationFB;
    this.quantityVibrationL = params.quantityVibrationL;

    this.activities = params.activities;
  }

  get isQuantity() {
    return getIsQuantity(this);
  }

  get probability(): IRiskProbabilityValues {
    return getQuantityProbability({ ...this }) || this.#probability;
  }
}
