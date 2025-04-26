import { RecommendationEntity } from '@/@v2/security/characterization/domain/entities/recomendation.entity';

export namespace IRiskRepository {
  export type FindByIdParams = { id: string };
  export type FindByIdReturn = Promise<RecommendationEntity | null>;

  export type FindParams = { riskId?: string };
  export type FindParamsReturn = Promise<RecommendationEntity[]>;
}
