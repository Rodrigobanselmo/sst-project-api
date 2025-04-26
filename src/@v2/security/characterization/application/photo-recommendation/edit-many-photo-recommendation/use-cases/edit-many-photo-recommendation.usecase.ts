import { PhotoRecommendationRepository } from '@/@v2/security/characterization/database/repositories/photo-recommendation/photo-recommendation.repository';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IEditManyPhotoRecommendationUseCase } from './edit-many-photo-recommendation.types';
import { EditPhotoRecommendationService } from '@/@v2/security/characterization/services/edit-photo-recommendation/edit-photo-recommendation.service';

@Injectable()
export class EditManyPhotoRecommendationUseCase {
  constructor(
    private readonly photoRecommendationRepository: PhotoRecommendationRepository,
    private readonly editPhotoRecommendationService: EditPhotoRecommendationService,
  ) {}

  async execute(params: IEditManyPhotoRecommendationUseCase.Params) {
    const photoRecommendations = await asyncBatch({
      items: params.photoIds,
      batchSize: 10,
      callback: async (photoId) => {
        const photoRecommendation = await this.editPhotoRecommendationService.update({
          companyId: params.companyId,
          isVisible: params.isVisible,
          recommendationId: params.recommendationId,
          riskDataId: params.riskDataId,
          photoId,
        });

        if (!photoRecommendation) throw new BadRequestException('Foto não encontrado');
        return photoRecommendation;
      },
    });

    await this.photoRecommendationRepository.upsertMany(photoRecommendations);
  }
}
