import { RiskTypeEnum } from "@/@v2/shared/domain/enum/security/risk-type.enum"
import { RiskDocumentsRequirementVO } from "@/@v2/shared/domain/values-object/document/risk-documents-requirement.vo"

export type IRiskModel = {
  id: string
  name: string
  severity: number
  type: RiskTypeEnum
  isEmergency: boolean
  isRepresentAll: boolean
  unit: string | null
  cas: string | null
  propagation: string[] | null
  nr15lt: string | null
  twa: string | null
  stel: string | null
  ipvs: string | null
  pe: string | null
  pv: string | null
  carnogenicityACGIH: string | null
  carnogenicityLinach: string | null
  symptoms: string | null
  healthRisk: string | null

  requirement: { document: RiskDocumentsRequirementVO }
  documentsRequirements: RiskDocumentsRequirementVO[]
}

export class RiskModel {
  id: string
  name: string
  severity: number
  type: RiskTypeEnum
  isEmergency: boolean
  isRepresentAll: boolean
  unit: string | null
  cas: string | null
  propagation: string[] | null
  nr15lt: string | null
  twa: string | null
  stel: string | null
  ipvs: string | null
  pe: string | null
  pv: string | null
  carnogenicityACGIH: string | null
  carnogenicityLinach: string | null
  symptoms: string | null
  healthRisk: string | null

  #requirements: { document: RiskDocumentsRequirementVO }
  #documentsRequirements: RiskDocumentsRequirementVO[]

  constructor(params: IRiskModel) {
    this.id = params.id
    this.name = params.name
    this.severity = params.severity
    this.type = params.type
    this.isEmergency = params.isEmergency
    this.isRepresentAll = params.isRepresentAll
    this.unit = params.unit
    this.cas = params.cas
    this.propagation = params.propagation
    this.nr15lt = params.nr15lt
    this.twa = params.twa
    this.stel = params.stel
    this.ipvs = params.ipvs
    this.pe = params.pe
    this.pv = params.pv
    this.carnogenicityACGIH = params.carnogenicityACGIH
    this.carnogenicityLinach = params.carnogenicityLinach
    this.symptoms = params.symptoms
    this.healthRisk = params.healthRisk


    this.#requirements = params.requirement
    this.#documentsRequirements = params.documentsRequirements
  }

  get documentsRequirements() {
    const documentsRequirements = this.#documentsRequirements
    documentsRequirements.push(this.#requirements.document)
    return documentsRequirements
  }
}