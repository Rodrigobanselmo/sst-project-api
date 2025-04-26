import { Injectable } from '@nestjs/common';
import { PhotoRecommendationRepository } from '../../database/repositories/photo-recommendation/photo-recommendation.repository';
import { IEditPhotoRecommendationService } from './edit-photo-recommendation.service.types';
import { PhotoRecommendationEntity } from '../../domain/entities/photo-recommendation.entity';

@Injectable()
export class EditPhotoRecommendationService {
  constructor(private readonly photoRecommendationRepository: PhotoRecommendationRepository) {}

  async update(params: IEditPhotoRecommendationService.Params) {
    let photoRecommendation = await this.photoRecommendationRepository.find({
      companyId: params.companyId,
      photoId: params.photoId,
      recommendationId: params.recommendationId,
      riskDataId: params.riskDataId,
    });

    if (!photoRecommendation) {
      photoRecommendation = new PhotoRecommendationEntity({
        photoId: params.photoId,
        recommendationId: params.recommendationId,
        riskDataId: params.riskDataId,
        isVisible: params.isVisible,
      });
    }

    photoRecommendation.update(params);

    return photoRecommendation;
  }
}
