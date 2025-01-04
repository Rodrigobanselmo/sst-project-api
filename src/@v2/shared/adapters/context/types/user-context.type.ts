type UserData = {
  id: number;
  permissions: string[];
}

type UserContextConstructor = { user: UserData }

export class UserContext {
  private user: UserData

  constructor({ user }: UserContextConstructor) {
    this.user = user
  }

  get id() {
    return this.user.id
  }

  getPermission(permission: string): boolean {
    return this.user.permissions.includes(permission)
  }
}