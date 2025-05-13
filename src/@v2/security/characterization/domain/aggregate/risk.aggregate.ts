import { Aggregate } from '@/@v2/shared/domain/entities/aggregate';
import { RecommendationEntity } from '../entities/recomendation.entity';
import { RiskEntity } from '../entities/risk.entity';

export type IRiskAggregate = {
  entity: RiskEntity;
  recomendations: () => Promise<RecommendationEntity[]>;
};

export class RiskAggregate {
  risk: RiskEntity;
  #recomendations: () => Promise<RecommendationEntity[]>;
  #aggregate: Aggregate = new Aggregate();

  constructor(params: IRiskAggregate) {
    this.risk = params.entity;
    this.#recomendations = params.recomendations;
  }

  async recomendations() {
    return this.#aggregate.get<RecommendationEntity[]>(() => this.#recomendations());
  }
}
