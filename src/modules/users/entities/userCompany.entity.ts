import { ApiProperty } from '@nestjs/swagger';

import { UserCompany } from '.prisma/client';

export class UserCompanyEntity implements UserCompany {
  @ApiProperty({ description: 'The id of the User' })
  userId: number;

  @ApiProperty({ description: 'The id of the company' })
  companyId: number;

  @ApiProperty({ example: ['admin'], description: 'The roles of the User' })
  roles: string[];

  @ApiProperty({
    example: ['user.create'],
    description: 'The permissions of the User',
  })
  permissions: string[];

  @ApiProperty({ description: 'The last time that the User was updated' })
  updatedAt: Date;

  @ApiProperty({ description: 'The creation date of the User account' })
  created_at: Date;

  constructor(partial: Partial<UserCompanyEntity>) {
    Object.assign(this, partial);
  }
}
