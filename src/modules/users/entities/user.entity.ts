import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { User } from '.prisma/client';
import { UserCompanyEntity } from './userCompany.entity';

export class UserEntity implements User {
  @ApiProperty({ description: 'The id of the User' })
  id: number;

  @ApiProperty({ description: 'The email of the User' })
  email: string;

  @ApiProperty({ description: 'The name of the User' })
  name: string;

  @ApiProperty({ description: 'The password of the User' })
  @Exclude()
  password: string;

  @ApiProperty({ description: 'The last time that the User was updated' })
  updated_at: Date;

  @ApiProperty({ description: 'The creation date of the User account' })
  created_at: Date;

  @ApiProperty({ description: 'The deleted date of data' })
  deleted_at: Date | null;

  @ApiProperty()
  companies?: UserCompanyEntity[];

  formation: string[];
  certifications: string[];
  cpf: string;
  crea: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
