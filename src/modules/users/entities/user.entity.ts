import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { User } from '.prisma/client';

export class UserEntity implements User {
  @ApiProperty({ description: 'The id of the User' })
  @ApiProperty()
  id: number;

  @ApiProperty({ description: 'The email of the User' })
  @ApiProperty()
  email: string;

  @ApiProperty({ description: 'The password of the User' })
  @Exclude()
  password: string;

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

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
