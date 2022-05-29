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
  ADMIN = 'admin',
  USER = 'user',
  MANAGEMENT = 'management',
  CONTRACTS = 'contracts',
  DATABASE = 'database',
  DOCS = 'docs',
  RISK = 'risk',
  CHECKLIST = 'checklist',
}

export enum PermissionEnum {
  MASTER = 'master',
  COMPANY = '2',
  CREATE_COMPANY = '2.1',
  CONTRACT = '3',
  EMPLOYEE = '4',
  HOMO_GROUP = '5',
  USER = '1',
  INVITE_USER = '1.1',
  CREATE_RISK = '10',
}
