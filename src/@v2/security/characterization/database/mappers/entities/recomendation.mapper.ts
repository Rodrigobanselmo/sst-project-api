import { RecMed } from '@prisma/client';
import { RecommendationEntity } from '../../../domain/entities/recomendation.entity';

type IRecomendationMapper = RecMed;

export class RecomendationMapper {
  static toEntity(prisma: IRecomendationMapper): RecommendationEntity {
    return new RecommendationEntity({
      ...prisma,
      name: prisma.recName!,
    });
  }

  static toEntities(prisma: IRecomendationMapper[]): RecommendationEntity[] {
    return prisma.map((rec) => RecomendationMapper.toEntity(rec));
  }
}
