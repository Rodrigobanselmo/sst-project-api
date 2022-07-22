import { ApiProperty } from '@nestjs/swagger';

import { AccessGroups } from '.prisma/client';

export class AccessGroupsEntity implements AccessGroups {
  @ApiProperty({ description: 'The id of the AccessGroups' })
  id: number;

  @ApiProperty({ description: 'The Refresh Token creation date' })
  created_at: Date;
  roles: string[];
  permissions: string[];

  constructor(partial: Partial<AccessGroupsEntity>) {
    Object.assign(this, partial);
  }
}
