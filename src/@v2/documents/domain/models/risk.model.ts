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

  requirements: { document: RiskDocumentsRequirementVO }
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

    this.#requirements = params.requirements
    this.#documentsRequirements = params.documentsRequirements
  }

  get documentsRequirements() {
    const documentsRequirements = this.#documentsRequirements
    documentsRequirements.push(this.#requirements.document)
    return documentsRequirements
  }
}