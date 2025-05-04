import { PhotoRecommendationEntity } from '../../../domain/entities/photo-recommendation.entity';

export interface IUpsertPhotoRecommendationData {
  photoId: string;
  riskDataId: string;
  recommendationId: string;
  isVisible: boolean;
}

export abstract class IPhotoRecommendationRepository {
  abstract findMany(params: IPhotoRecommendationRepository.FindManyParams): IPhotoRecommendationRepository.FindManyReturn;
  abstract find(params: IPhotoRecommendationRepository.FindParams): IPhotoRecommendationRepository.FindReturn;
  abstract upsertMany(params: IPhotoRecommendationRepository.UpsertManyParams): IPhotoRecommendationRepository.UpsertManyReturn;
}

export namespace IPhotoRecommendationRepository {
  export type FindParams = { companyId: string; photoId: string; riskDataId: string; recommendationId: string };
  export type FindReturn = Promise<PhotoRecommendationEntity | null>;

  export type FindManyParams = { companyId: string; photoIds: string[]; riskDataId: string; recommendationId: string };
  export type FindManyReturn = Promise<PhotoRecommendationEntity[]>;

  export type UpsertManyParams = IUpsertPhotoRecommendationData[];
  export type UpsertManyReturn = Promise<void>;
}
