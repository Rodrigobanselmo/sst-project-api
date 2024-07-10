import { StatusEnum } from '@prisma/client';

import { CompanyEntity } from '../../../modules/company/entities/company.entity';
import { AccessGroupsEntity } from './../../auth/entities/access-groups.entity';
import { UserEntity } from './user.entity';
import { UserCompany } from '.prisma/client';

export class UserCompanyEntity implements UserCompany {
  userId: number;
  companyId: string;
  roles: string[];
  permissions: string[];
  updated_at: Date;
  created_at: Date;
  status: StatusEnum;
  groupId: number;
  group?: AccessGroupsEntity;
  company?: CompanyEntity;
  user?: UserEntity;

  constructor(partial: Partial<Omit<UserCompanyEntity, 'group'>> & { group?: any }) {
    Object.assign(this, partial);

    if (this.group) {
      this.group = new AccessGroupsEntity(this.group);
      if (this.group?.permissions) this.permissions = this.group.permissions;
      if (this.group?.roles) this.roles = this.group.roles;
    }

    if (this.company) this.company = new CompanyEntity(this.company);
    if (this.user) this.user = new UserEntity(this.user);
  }
}
