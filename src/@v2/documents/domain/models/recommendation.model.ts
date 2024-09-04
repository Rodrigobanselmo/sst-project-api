import { RecommendationTypeEnum } from "@/@v2/shared/domain/enum/security/recommendation-type.enum"

export type IRecommendationModel = {
  name: string
  type: RecommendationTypeEnum
}

export class RecommendationModel {
  name: string
  type: RecommendationTypeEnum


  constructor(params: IRecommendationModel) {
    this.name = params.name
    this.type = params.type
  }
}