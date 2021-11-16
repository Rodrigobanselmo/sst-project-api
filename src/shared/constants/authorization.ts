// x.c - create
// x.r - read
// x.u - update
// x.d - delete
// x.cr - create/read
// x.crud - all operations

// 1 - users
// 1.crud.A
// 1.crud
// 1.A
// 1

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
export enum Permission {
  USER = '1',
  INVITE_USER = '1.1',
}

export enum SpecialPermission {
  YOUR_COMPANY = 'C',
}
