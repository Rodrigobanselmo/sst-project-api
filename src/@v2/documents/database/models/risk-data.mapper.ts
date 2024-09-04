import { QuantityTypeEnum } from '@/@v2/shared/domain/enum/security/quantity-type.enum';
import { RecommendationTypeEnum } from '@/@v2/shared/domain/enum/security/recommendation-type.enum';
import { ExamRequirementsVO } from '@/@v2/shared/domain/values-object/medicine/exam-requirements.vo';
import { RiskDataQuantityHeatVO } from '@/@v2/shared/domain/values-object/security/risk-data-quantity-heat.vo';
import { RiskDataQuantityNoiseVO } from '@/@v2/shared/domain/values-object/security/risk-data-quantity-noise.vo';
import { RiskDataQuantityQuiVO } from '@/@v2/shared/domain/values-object/security/risk-data-quantity-qui.vo';
import { RiskDataQuantityRadiationVO } from '@/@v2/shared/domain/values-object/security/risk-data-quantity-radiation.vo';
import { RiskDataQuantityVibrationFBVO } from '@/@v2/shared/domain/values-object/security/risk-data-quantity-vibration-fb.vo';
import { RiskDataQuantityVibrationLVO } from '@/@v2/shared/domain/values-object/security/risk-data-quantity-vibration-l.vo';
import { Epi, EpiToRiskFactorData, ExamToRiskData, RecTypeEnum as PrismaRecTypeEnum, RecMed, RiskFactorData, RiskFactors, RiskFactorsDocInfo } from '@prisma/client';
import { AdministrativeMeasureModel } from '../../domain/models/administrative-measure.model';
import { EgineeringMeasureModel } from '../../domain/models/engineering-measure.model';
import { EPIModel } from '../../domain/models/epis.model';
import { ExamRiskModel } from '../../domain/models/exam-risk.model';
import { GenerateSourceModel } from '../../domain/models/generate-source.model';
import { RecommendationModel } from '../../domain/models/recommendation.model';
import { IRiskDataModel, RiskDataModel } from '../../domain/models/risk-data.model';
import { IRiskMapper, RiskMapper } from './risk.mapper';

export type IRiskDataMapper = RiskFactorData & {
  riskFactor: IRiskMapper
  adms: { medName: string | null }[]
  recs: { recName: string | null; recType: PrismaRecTypeEnum | null }[]
  generateSources: { name: string | null }[]
  engsToRiskFactorData: {
    recMed: RecMed
    efficientlyCheck: boolean
  }[]
  epiToRiskFactorData: (EpiToRiskFactorData & {
    epi: Epi
  })[]
  examsToRiskFactorData: ExamToRiskData[]
}

export class RiskDataMapper {
  static toModel(data: IRiskDataMapper): RiskDataModel {
    return new RiskDataModel({
      ...this.quantityParse(data),
      probability: data.probability,
      probabilityAfter: data.probabilityAfter,
      administrativeMeasures: data.adms.map(adm => new AdministrativeMeasureModel({ name: adm.medName || '' })),
      recommendations: data.recs.map(rec => new RecommendationModel({
        name: rec.recName || '',
        type: rec.recType as RecommendationTypeEnum,
      })),
      generateSources: data.generateSources.map(gs => new GenerateSourceModel({ name: gs.name || '' })),
      egineeringMeasures: data.engsToRiskFactorData.map(eng => new EgineeringMeasureModel({
        name: eng.recMed.medName || '',
        efficientlyCheck: eng.efficientlyCheck,
      })),
      epis: data.epiToRiskFactorData.map(epi => new EPIModel({
        ca: epi.epi.ca,
      })),
      exams: data.examsToRiskFactorData.map(exam => new ExamRiskModel({
        examId: exam.examId,
        requirements: new ExamRequirementsVO(exam)
      })),
      risk: RiskMapper.toModel(data.riskFactor),
    })
  }

  static toModels(data: IRiskDataMapper[]): RiskDataModel[] {
    return data.map(RiskData => this.toModel(RiskData))
  }

  private static quantityParse(data: IRiskDataMapper) {
    const quantityObject: Pick<IRiskDataModel, 'quantityQui' | 'quantityHeat' | 'quantityRadiation' | 'quantityVibrationFB' | 'quantityNoise' | 'quantityVibrationL'> = {
      quantityQui: null,
      quantityNoise: null,
      quantityVibrationFB: null,
      quantityVibrationL: null,
      quantityRadiation: null,
      quantityHeat: null,
    }

    const json = data.json as any
    if (!json) return quantityObject
    if (typeof json !== 'object') return quantityObject

    if (json.type === QuantityTypeEnum.QUI) quantityObject.quantityQui = new RiskDataQuantityQuiVO(json)
    if (json.type === QuantityTypeEnum.NOISE) quantityObject.quantityNoise = new RiskDataQuantityNoiseVO(json)
    if (json.type === QuantityTypeEnum.VFB) quantityObject.quantityVibrationFB = new RiskDataQuantityVibrationFBVO(json)
    if (json.type === QuantityTypeEnum.VL) quantityObject.quantityVibrationL = new RiskDataQuantityVibrationLVO(json)
    if (json.type === QuantityTypeEnum.RADIATION) quantityObject.quantityRadiation = new RiskDataQuantityRadiationVO(json)
    if (json.type === QuantityTypeEnum.HEAT) quantityObject.quantityHeat = new RiskDataQuantityHeatVO(json)

    return quantityObject
  }
}

