
export type IRecomendationEntity = {
  id: string;
  name: string;
  riskId: string;
}

export class RecomendationEntity {
  id: string;
  name: string;
  riskId: string;

  constructor(partial: IRecomendationEntity) {
    this.id = partial.id;
    this.name = partial.name;
    this.riskId = partial.riskId;
  }
}
