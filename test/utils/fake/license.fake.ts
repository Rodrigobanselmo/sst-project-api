import { LicenseDto } from './../../../src/modules/company/dto/license.dto';

import { InviteUserDto } from '../../../src/modules/users/dto/invite-user.dto';

export class FakeLicense implements LicenseDto {
  constructor(partial?: Partial<InviteUserDto>) {
    Object.assign(this, partial);
  }
  status = 'ACTIVE';
}
