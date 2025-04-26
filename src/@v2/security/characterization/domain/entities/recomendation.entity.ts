export type IRecommendationEntity = {
  id: string;
  name: string;
  riskId: string;
};

export class RecommendationEntity {
  id: string;
  name: string;
  riskId: string;

  constructor(partial: IRecommendationEntity) {
    this.id = partial.id;
    this.name = partial.name;
    this.riskId = partial.riskId;
  }
}
