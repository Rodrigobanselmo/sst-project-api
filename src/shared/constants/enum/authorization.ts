// x-c - create
// x-r - read
// x-u - update
// x-d - delete
// x-cr - create/read
// x-crud - all operations

// 1 - users
// 1-crud-A
// 1-crud
// 1-A
// 1

export enum RoleEnum {
  MASTER = 'master',
  USER = 'user',
  ADMIN = 'admin',
}

export enum PermissionEnum {
  MASTER = 'master',
  USER = '1',
  INVITE_USER = '1.1',
  CREATE_COMPANY = '2',
  CREATE_RISK = '3',
}
