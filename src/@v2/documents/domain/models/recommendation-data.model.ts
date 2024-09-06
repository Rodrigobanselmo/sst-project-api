
export type IRecommendationDataModel = {
  recommendationId: string
  responsibleName: string | null
  endDate: Date | null
}

export class RecommendationDataModel {
  recommendationId: string
  responsibleName: string | null
  endDate: Date | null

  constructor(params: IRecommendationDataModel) {
    this.recommendationId = params.recommendationId
    this.responsibleName = params.responsibleName
    this.endDate = params.endDate
  }
}