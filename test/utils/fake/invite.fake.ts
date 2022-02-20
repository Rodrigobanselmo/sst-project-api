import * as faker from 'faker';
import { Permission } from '../../../src/shared/constants/enum/authorization';

import { InviteUserDto } from '../../../src/modules/users/dto/invite-user.dto';

export class FakeInvite implements InviteUserDto {
  constructor(partial?: Partial<InviteUserDto>) {
    Object.assign(this, partial);
  }
  email = faker.lorem.word() + faker.internet.email();
  companyId = '1';
  roles: string[] = ['admin'];
  permissions: string[] = [
    Permission.USER,
    Permission.INVITE_USER,
    Permission.CREATE_COMPANY,
  ];

  pushPermissions(permission: string) {
    return this.permissions.push(permission);
  }
  pushRoles(permission: string) {
    return this.roles.push(permission);
  }
}
