import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { User } from '.prisma/client';
import { UserCompanyEntity } from './userCompany.entity';

export class UserEntity implements User {
  @ApiProperty({ description: 'The id of the User' })
  id: number;

  @ApiProperty({ description: 'The email of the User' })
  email: string;

  @ApiProperty({ description: 'The password of the User' })
  @Exclude()
  password: string;

  @ApiProperty({ description: 'The last time that the User was updated' })
  updatedAt: Date;

  @ApiProperty({ description: 'The creation date of the User account' })
  created_at: Date;

  @ApiProperty()
  companies?: UserCompanyEntity[];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
