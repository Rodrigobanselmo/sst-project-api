import { ApiProperty } from '@nestjs/swagger';

import { RefreshToken } from '.prisma/client';

export class RefreshTokenEntity implements RefreshToken {
  @ApiProperty({ description: 'The id of the RefreshToken' })
  id: string;

  @ApiProperty({ description: 'The token value' })
  refresh_token: string;

  @ApiProperty({ description: 'The user id that this token refers to' })
  userId: number;

  @ApiProperty({ description: 'The Refresh Token expiration date' })
  expires_date: Date;

  @ApiProperty({ description: 'The Refresh Token creation date' })
  created_at: Date;

  constructor(partial: Partial<RefreshTokenEntity>) {
    Object.assign(this, partial);
  }
}
