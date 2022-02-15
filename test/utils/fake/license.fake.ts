import { LicenseDto } from './../../../src/modules/company/dto/license.dto';

import { InviteUserDto } from '../../../src/modules/users/dto/invite-user.dto';
import { StatusEnum } from '@prisma/client';

export class FakeLicense implements LicenseDto {
  constructor(partial?: Partial<InviteUserDto>) {
    Object.assign(this, partial);
  }
  status = StatusEnum.ACTIVE;
}
