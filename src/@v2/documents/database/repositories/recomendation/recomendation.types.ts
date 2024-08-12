import { RecomendationEntity } from "@/@v2/security/domain/entities/recomendation.entity";

export namespace IRiskRepository {
  export type FindByIdParams = { id: string; }
  export type FindByIdReturn = Promise<RecomendationEntity | null>

  export type FindParams = { riskId?: string }
  export type FindParamsReturn = Promise<RecomendationEntity[]>
}