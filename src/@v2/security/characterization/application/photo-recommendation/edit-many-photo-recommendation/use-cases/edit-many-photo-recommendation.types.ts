export namespace IEditManyPhotoRecommendationUseCase {
  export type Params = {
    companyId: string;
    riskDataId: string;
    photoIds: string[];
    recommendationId: string;
    isVisible: boolean;
  };
}
