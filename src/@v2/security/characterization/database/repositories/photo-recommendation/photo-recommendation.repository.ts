import { Injectable } from '@nestjs/common';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { IPhotoRecommendationRepository } from './photo-recommendation.repository.types';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch'; // Assuming asyncBatch is available at this path
import { PhotoRecommendationMapper } from '../../mappers/entities/photo-recommendation.mapper';

@Injectable()
export class PhotoRecommendationRepository implements IPhotoRecommendationRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async findMany({ photoIds, riskDataId, recommendationId, companyId }: IPhotoRecommendationRepository.FindManyParams): IPhotoRecommendationRepository.FindManyReturn {
    const models = await this.prisma.characterizationPhotoRecommendation.findMany({
      where: {
        photo_id: { in: photoIds },
        risk_data_id: riskDataId,
        recommendation_id: recommendationId,
        riskFactorData: {
          companyId: companyId,
        },
      },
    });
    return PhotoRecommendationMapper.toEntities(models);
  }

  async find({ photoId, riskDataId, recommendationId, companyId }: IPhotoRecommendationRepository.FindParams): IPhotoRecommendationRepository.FindReturn {
    const model = await this.prisma.characterizationPhotoRecommendation.findFirst({
      where: {
        photo_id: photoId,
        risk_data_id: riskDataId,
        recommendation_id: recommendationId,
        riskFactorData: {
          companyId: companyId,
        },
      },
    });
    return model ? PhotoRecommendationMapper.toEntity(model) : null;
  }

  async upsertMany(data: IPhotoRecommendationRepository.UpsertManyParams): IPhotoRecommendationRepository.UpsertManyReturn {
    await this.prisma.$transaction(async (tx) => {
      await asyncBatch({
        items: data,
        batchSize: 10,
        callback: async (item) => {
          await tx.characterizationPhotoRecommendation.upsert({
            where: {
              risk_data_id_recommendation_id_photo_id: {
                risk_data_id: item.riskDataId,
                recommendation_id: item.recommendationId,
                photo_id: item.photoId,
              },
            },
            update: {
              is_visible: item.isVisible,
            },
            create: {
              risk_data_id: item.riskDataId,
              recommendation_id: item.recommendationId,
              photo_id: item.photoId,
              is_visible: item.isVisible,
            },
            select: { id: true },
          });
        },
      });
    });
  }
}
