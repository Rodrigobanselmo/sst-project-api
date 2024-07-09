import { RefreshToken } from '.prisma/client';

export class RefreshTokenEntity implements RefreshToken {
  id: string;
  refresh_token: string;
  userId: number;
  expires_date: Date;
  created_at: Date;

  constructor(partial: Partial<RefreshTokenEntity>) {
    Object.assign(this, partial);
  }
}
