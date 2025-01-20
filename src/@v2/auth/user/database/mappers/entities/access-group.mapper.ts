import { AccessGroups } from '@prisma/client';
import { AccessGroupEntity } from '../../../domain/entities/access-group.entity';
import { PermissionAccessEnum } from '../../../domain/enums/permission-access';
import { RoleAccessEnum } from '../../../domain/enums/role-access.enum';

export type IAccessGroupEntityMapper = AccessGroups;

export class AccessGroupMapper {
  static toEntity(data: IAccessGroupEntityMapper): AccessGroupEntity {
    return new AccessGroupEntity({
      id: data.id,
      permissions: data.permissions as PermissionAccessEnum[],
      roles: data.roles as RoleAccessEnum[],
    });
  }
}
