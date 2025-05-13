export type IUpdatePhotoRecommendation = {
  isVisible?: boolean;
};

export type IPhotoRecommendation = {
  id?: number;
  createdAt?: Date;
  isVisible: boolean;
  riskDataId: string;
  recommendationId: string;
  photoId: string;
};

export class PhotoRecommendationEntity {
  readonly id?: number;
  readonly createdAt: Date;
  readonly riskDataId: string;
  readonly recommendationId: string;
  readonly photoId: string;

  private _isVisible: boolean;

  constructor(params: IPhotoRecommendation) {
    this.id = params.id;
    this.createdAt = params.createdAt || new Date();
    this._isVisible = params.isVisible;
    this.riskDataId = params.riskDataId;
    this.recommendationId = params.recommendationId;
    this.photoId = params.photoId;
  }

  get isVisible() {
    return this._isVisible;
  }

  update(params: IUpdatePhotoRecommendation) {
    if (params.isVisible !== undefined && params.isVisible !== null) {
      this._isVisible = params.isVisible;
    }
  }
}
