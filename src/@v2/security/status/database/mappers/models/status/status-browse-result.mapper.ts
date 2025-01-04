import { StatusBrowseResultModel } from '@/@v2/security/status/domain/models/status/status-browse-result.model';
import { Status as PrismaStatus } from '@prisma/client';

export type IStatusBrowseResultModelMapper = PrismaStatus

export class StatusBrowseResultModelMapper {
  static toModel(prisma: IStatusBrowseResultModelMapper): StatusBrowseResultModel {
    return new StatusBrowseResultModel({
      id: prisma.id,
      name: prisma.name,
      color: prisma.color || undefined,
    })
  }

  static toModels(prisma: IStatusBrowseResultModelMapper[]): StatusBrowseResultModel[] {
    return prisma.map((rec) => StatusBrowseResultModelMapper.toModel(rec))
  }
}
