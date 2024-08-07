import { RiskEntity, IRiskEntity } from "../entities/risk.entity"
import { RecomendationEntity } from "../entities/recomendation.entity"

export type IRiskAggregateRelations = {
  recomendations: (riskId: string) => Promise<RecomendationEntity[]>
}

export type IRiskAggregate = IRiskEntity & IRiskAggregateRelations


export class RiskAggregate {
  risk: RiskEntity;

  #recomendations?: RecomendationEntity[]
  #getRecomendations: (riskId: string) => Promise<RecomendationEntity[]>

  constructor(params: IRiskAggregate) {
    this.risk = new RiskEntity(params);
    this.#getRecomendations = params.recomendations
  }

  async recomendations() {
    if (!this.#recomendations) this.#recomendations = await this.#getRecomendations(this.risk.id)
    return this.#recomendations
  }
}




