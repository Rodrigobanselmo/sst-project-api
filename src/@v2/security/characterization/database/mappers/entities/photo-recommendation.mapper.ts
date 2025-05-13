import { CharacterizationPhotoRecommendation } from '@prisma/client';
import { PhotoRecommendationEntity } from '../../../domain/entities/photo-recommendation.entity';

type IPhotoRecommendationMapper = CharacterizationPhotoRecommendation;

export class PhotoRecommendationMapper {
  static toEntity(model: IPhotoRecommendationMapper): PhotoRecommendationEntity {
    return new PhotoRecommendationEntity({
      id: model.id,
      createdAt: model.created_at,
      isVisible: model.is_visible,
      riskDataId: model.risk_data_id,
      recommendationId: model.recommendation_id,
      photoId: model.photo_id,
    });
  }

  static toEntities(prisma: IPhotoRecommendationMapper[]): PhotoRecommendationEntity[] {
    return prisma.map((rec) => PhotoRecommendationMapper.toEntity(rec));
  }
}
