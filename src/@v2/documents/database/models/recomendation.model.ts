import { RecMed } from '@prisma/client';
import { RecomendationEntity } from '../../domain/entities/attachment.entity';

type IRecomendationModel = RecMed

export class RecomendationModel {
  static toEntity(prisma: IRecomendationModel): RecomendationEntity {
    return new RecomendationEntity({
      ...prisma,
      name: prisma.recName!,
    })
  }

  static toEntities(prisma: IRecomendationModel[]): RecomendationEntity[] {
    return prisma.map((rec) => RecomendationModel.toEntity(rec))
  }
}
