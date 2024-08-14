import { Aggregate } from "../../../shared/domain/entities/aggregate"
import { RecomendationEntity } from "../entities/attachment.entity"
import { RiskEntity } from "../entities/risk.entity"


export type IRiskAggregate = {
  entity: RiskEntity
  recomendations: (riskId: string) => Promise<RecomendationEntity[]>
}

export class RiskAggregate {
  risk: RiskEntity;
  #recomendations: (riskId: string) => Promise<RecomendationEntity[]>
  #aggregate: Aggregate = new Aggregate();

  constructor(params: IRiskAggregate) {
    this.risk = params.entity;
    this.#recomendations = params.recomendations
  }

  async recomendations() {
    return this.#aggregate.get<RecomendationEntity[]>(() => this.#recomendations(this.risk.id))
  }
}
