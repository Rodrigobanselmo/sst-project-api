import { RecMed } from '@prisma/client';
import { RecomendationEntity } from '../../../domain/entities/recomendation.entity';

type IRecomendationMapper = RecMed

export class RecomendationMapper {
  static toEntity(prisma: IRecomendationMapper): RecomendationEntity {
    return new RecomendationEntity({
      ...prisma,
      name: prisma.recName!,
    })
  }

  static toEntities(prisma: IRecomendationMapper[]): RecomendationEntity[] {
    return prisma.map((rec) => RecomendationMapper.toEntity(rec))
  }
}
