import { RoleEnum } from '@/shared/constants/enum/authorization';

type UserData = {
  id: number;
  permissions: string[];
  roles: string[];
};

type UserContextConstructor = { user: UserData };

export class UserContext {
  private user: UserData;

  constructor({ user }: UserContextConstructor) {
    this.user = user;
  }

  get id() {
    return this.user.id;
  }

  get permissions() {
    return this.user.permissions;
  }

  get roles() {
    return this.user.roles;
  }

  get isAdmin() {
    return this.user.roles.includes(RoleEnum.MASTER);
  }

  getPermission(permission: string): boolean {
    return this.user.permissions.includes(permission);
  }
}
