import * as faker from 'faker';
import { PermissionEnum } from '../../../src/shared/constants/enum/authorization';

import { InviteUserDto } from '../../../src/modules/users/dto/invite-user.dto';

export class FakeInvite implements InviteUserDto {
  constructor(partial?: Partial<InviteUserDto>) {
    Object.assign(this, partial);
  }
  email = faker.lorem.word() + faker.internet.email();
  companyId = '1';
  roles: string[] = ['admin'];
  permissions: string[] = [
    PermissionEnum.USER,
    PermissionEnum.USER,
    PermissionEnum.DOCUMENTS,
  ];

  pushPermissions(permission: string) {
    return this.permissions.push(permission);
  }
  pushRoles(permission: string) {
    return this.roles.push(permission);
  }
}
