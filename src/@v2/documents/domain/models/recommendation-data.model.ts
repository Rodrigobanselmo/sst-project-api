import { StatusEnum } from '@prisma/client'

export type IRecommendationDataModel = {
  recommendationId: string
  responsibleName: string | null
  endDate: Date | null
  status: StatusEnum
}

export class RecommendationDataModel {
  recommendationId: string
  responsibleName: string | null
  endDate: Date | null
  status: StatusEnum

  constructor(params: IRecommendationDataModel) {
    this.recommendationId = params.recommendationId
    this.responsibleName = params.responsibleName
    this.endDate = params.endDate
    this.status = params.status
  }
}