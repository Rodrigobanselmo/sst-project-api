import { RecommendationTypeEnum } from "@/@v2/shared/domain/enum/security/recommendation-type.enum"

export type IRecommendationModel = {
  id: string
  name: string
  type: RecommendationTypeEnum
}

export class RecommendationModel {
  id: string
  name: string
  type: RecommendationTypeEnum


  constructor(params: IRecommendationModel) {
    this.id = params.id
    this.name = params.name
    this.type = params.type
  }
}