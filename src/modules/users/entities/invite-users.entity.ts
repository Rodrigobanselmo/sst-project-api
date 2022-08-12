import { ApiProperty } from '@nestjs/swagger';

import { InviteUsers } from '.prisma/client';

export class InviteUsersEntity implements InviteUsers {
  @ApiProperty({ description: 'The id of the invite token' })
  id: string;

  @ApiProperty({ description: 'The email of the User' })
  email: string;

  @ApiProperty({ example: ['admin'], description: 'The roles of the User' })
  roles: string[];

  @ApiProperty({
    example: ['user.create'],
    description: 'The permissions of the User',
  })
  permissions: string[];

  @ApiProperty({ description: 'The expiration date of the User invite' })
  expires_date: Date;

  @ApiProperty({ description: 'The company id for user invitation' })
  companyId: string;

  @ApiProperty()
  companyName?: string;

  @ApiProperty()
  logo?: string;

  constructor(partial: Partial<InviteUsersEntity>) {
    Object.assign(this, partial);
  }
  companiesIds: string[];
  groupId: number;
  professionalId: number;
}
