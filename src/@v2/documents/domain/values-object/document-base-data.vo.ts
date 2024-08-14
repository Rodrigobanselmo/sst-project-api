export type IDocumentBaseDataVO = {
  isQ5?: boolean
  hasEmergencyPlan?: boolean
  source?: string
  visitDate?: Date
  complementaryDocs?: string[]
  complementarySystems?: string[]
  months_period_level_2?: number
  months_period_level_3?: number
  months_period_level_4?: number
  months_period_level_5?: number
}

export class DocumentBaseDataVO {
  isQ5: boolean
  hasEmergencyPlan: boolean
  source?: string
  visitDate?: Date
  complementaryDocs: string[]
  complementarySystems: string[]
  months_period_level_2: number
  months_period_level_3: number
  months_period_level_4: number
  months_period_level_5: number


  constructor(params: IDocumentBaseDataVO) {
    this.isQ5 = params.isQ5 || false
    this.hasEmergencyPlan = params.hasEmergencyPlan || false
    this.source = params.source
    this.visitDate = params.visitDate
    this.complementaryDocs = params.complementaryDocs || []
    this.complementarySystems = params.complementarySystems || []
    this.months_period_level_2 = params.months_period_level_2 || 24
    this.months_period_level_3 = params.months_period_level_3 || 12
    this.months_period_level_4 = params.months_period_level_4 || 6
    this.months_period_level_5 = params.months_period_level_5 || 3
  }
}
