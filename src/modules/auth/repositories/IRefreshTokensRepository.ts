import { RefreshTokenEntity } from '../entities/refresh-tokens.entity';
import { Prisma } from '.prisma/client';

interface IRefreshTokensRepository {
  create(
    refresh_token: string,
    userId: number,
    expires_date: Date,
  ): Promise<RefreshTokenEntity>;
  findByRefreshToken(
    refresh_token: string,
  ): Promise<RefreshTokenEntity | undefined>;
  findByUserIdAndRefreshToken(
    userId: number,
    refresh_token: string,
  ): Promise<RefreshTokenEntity | undefined>;
  deleteById(id: string): Promise<void>;
  deleteByRefreshToken(refresh_token: string): Promise<void>;
  deleteAllOldTokens(currentDate: Date): Promise<Prisma.BatchPayload>;
}
export { IRefreshTokensRepository };
