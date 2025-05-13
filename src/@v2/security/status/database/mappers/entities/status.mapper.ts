import { StatusEntity } from '@/@v2/security/status/domain/entities/status.entity';
import { Status } from '@prisma/client';

type IStatusEntityMapper = Status;

export class StatusMapper {
  static toEntity(data: IStatusEntityMapper): StatusEntity {
    return new StatusEntity({
      id: data.id,
      name: data.name,
      type: data.type,
      color: data.color,
      companyId: data.companyId,
      deletedAt: data.deleted_at,
    });
  }
}
