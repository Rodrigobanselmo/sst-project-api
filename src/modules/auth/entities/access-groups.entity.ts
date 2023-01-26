import { AlertEntity } from './../../company/entities/alert.entity';
import { InviteUsersEntity } from './../../users/entities/invite-users.entity';
import { CompanyEntity } from './../../company/entities/company.entity';
import { ApiProperty } from '@nestjs/swagger';

import { AccessGroups } from '.prisma/client';
import { UserCompanyEntity } from './../../../modules/users/entities/userCompany.entity';

export class AccessGroupsEntity implements AccessGroups {
  @ApiProperty({ description: 'The id of the AccessGroups' })
  id: number;

  @ApiProperty({ description: 'The Refresh Token creation date' })
  created_at: Date;
  roles: string[];
  permissions: string[];
  companyId: string;
  system: boolean;
  name: string;
  description: string;

  company?: CompanyEntity;
  invites?: InviteUsersEntity[];
  users?: UserCompanyEntity[];
  alerts?: AlertEntity[];

  constructor(partial: Partial<AccessGroupsEntity>) {
    Object.assign(this, partial);

    if (this.company) {
      this.company = new CompanyEntity(this.company);
    }

    if (this.invites) {
      this.invites = this.invites.map((invite) => new InviteUsersEntity(invite));
    }

    if (this.users) {
      this.users = this.users.map((user) => new UserCompanyEntity(user));
    }

    if (this.alerts) {
      this.alerts = this.alerts.map((alert) => new AlertEntity(alert));
    }
  }
}
