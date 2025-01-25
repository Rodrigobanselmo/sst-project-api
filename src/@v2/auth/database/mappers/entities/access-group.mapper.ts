import { AccessGroups } from '@prisma/client';
import { AccessGroupEntity } from '../../../domain/entities/access-group.entity';

export type IAccessGroupEntityMapper = AccessGroups;

export class AccessGroupMapper {
  static toEntity(data: IAccessGroupEntityMapper): AccessGroupEntity {
    return new AccessGroupEntity({
      id: data.id,
      permissions: data.permissions,
      roles: data.roles,
    });
  }
}
