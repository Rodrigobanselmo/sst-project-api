import { ApiProperty } from '@nestjs/swagger';
import { StatusEnum } from '@prisma/client';

import { CompanyEntity } from '../../../modules/company/entities/company.entity';
import { AccessGroupsEntity } from './../../auth/entities/access-groups.entity';
import { UserEntity } from './user.entity';
import { UserCompany } from '.prisma/client';

export class UserCompanyEntity implements UserCompany {
  @ApiProperty({ description: 'The id of the User' })
  userId: number;

  @ApiProperty({ description: 'The id of the company' })
  companyId: string;

  @ApiProperty({ example: ['admin'], description: 'The roles of the User' })
  roles: string[];

  @ApiProperty({
    example: ['user.create'],
    description: 'The permissions of the User',
  })
  permissions: string[];

  @ApiProperty({ description: 'The last time that the User was updated' })
  updated_at: Date;

  @ApiProperty({ description: 'The creation date of the User account' })
  created_at: Date;

  @ApiProperty({
    description: 'The current status of the user account',
    examples: ['ACTIVE', 'PENDING', 'CANCELED'],
  })
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
