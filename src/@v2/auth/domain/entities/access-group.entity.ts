export type IAccessGroupEntity = {
  id: number;
  roles: string[];
  permissions: string[];
};

export class AccessGroupEntity {
  id: number;
  roles: string[];
  permissions: string[];

  constructor(params: IAccessGroupEntity) {
    this.id = params.id;
    this.roles = params.roles;
    this.permissions = params.permissions;
  }

  checkAllRoles(roles: string[]): boolean {
    return this.roles.every((role) => roles.includes(role));
  }

  checkAllPermissions(permissions: string[]): boolean {
    const hasAllPermissions = this.permissions.every((addPermission) =>
      permissions.some(
        (userPermission) =>
          userPermission.split('-')[0] === addPermission.split('-')[0] &&
          Array.from(addPermission.split('-')[1] || '').every((crud) =>
            (userPermission.split('-')[1] || '').includes(crud),
          ),
      ),
    );

    return hasAllPermissions;
  }
}
