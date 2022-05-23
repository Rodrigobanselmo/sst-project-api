import { PrismaService } from '../../../../prisma/prisma.service';
import { RefreshTokenEntity } from '../../entities/refresh-tokens.entity';
import { IRefreshTokensRepository } from '../IRefreshTokensRepository.types';
export declare class RefreshTokensRepository implements IRefreshTokensRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(refresh_token: string, userId: number, expires_date: Date): Promise<RefreshTokenEntity>;
    findById(id: string): Promise<RefreshTokenEntity>;
    findByRefreshToken(refresh_token: string): Promise<RefreshTokenEntity>;
    findByUserIdAndRefreshToken(userId: number, refresh_token: string): Promise<RefreshTokenEntity>;
    deleteById(id: string): Promise<void>;
    deleteAllOldTokens(date: Date): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteByRefreshToken(refresh_token: string): Promise<void>;
}
