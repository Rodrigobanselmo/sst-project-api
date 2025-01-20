import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';
import { RoleAccessEnum } from '../enums/role-access.enum';
import { PermissionAccessEnum } from '../enums/permission-access';

export type IAccessGroupEntity = {
  id: number;
  roles: RoleAccessEnum[];
  permissions: PermissionAccessEnum[];
};

export class AccessGroupEntity {
  id: number;
  roles: RoleAccessEnum[];
  permissions: PermissionAccessEnum[];

  constructor(params: IAccessGroupEntity) {
    this.id = params.id;
    this.roles = params.roles;
    this.permissions = params.permissions;
  }
}
