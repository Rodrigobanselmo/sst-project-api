import { Aggregate } from "@/@v2/shared/domain/entities/aggregate"
import { RecomendationEntity } from "../entities/recomendation.entity"
import { RiskEntity } from "../entities/risk.entity"


export type IRiskAggregate = {
  entity: RiskEntity
  recomendations: () => Promise<RecomendationEntity[]>
}

export class RiskAggregate {
  risk: RiskEntity;
  #recomendations: () => Promise<RecomendationEntity[]>
  #aggregate: Aggregate = new Aggregate();

  constructor(params: IRiskAggregate) {
    this.risk = params.entity;
    this.#recomendations = params.recomendations
  }

  async recomendations() {
    return this.#aggregate.get<RecomendationEntity[]>(() => this.#recomendations())
  }
}
