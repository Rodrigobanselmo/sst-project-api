import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { RefreshTokenEntity } from '../../entities/refresh-tokens.entity';
import { IRefreshTokensRepository } from '../IRefreshTokensRepository.types';

@Injectable()
export class RefreshTokensRepository implements IRefreshTokensRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(refresh_token: string, userId: number, expires_date: Date) {
    const refreshToken = await this.prisma.refreshToken.create({
      data: {
        refresh_token,
        expires_date,
        userId,
      },
    });
    return new RefreshTokenEntity(refreshToken);
  }

  async findById(id: string) {
    const userTokens = await this.prisma.refreshToken.findUnique({
      where: { id },
    });
    if (!userTokens) return;

    return new RefreshTokenEntity(userTokens);
  }

  async findByRefreshToken(refresh_token: string) {
    const userTokens = await this.prisma.refreshToken.findFirst({
      where: { refresh_token },
    });
    if (!userTokens) return;

    return new RefreshTokenEntity(userTokens);
  }

  async findByUserIdAndRefreshToken(userId: number, refresh_token: string) {
    const userTokens = await this.prisma.refreshToken.findFirst({
      where: { userId, refresh_token },
    });

    if (!userTokens) return;

    return new RefreshTokenEntity(userTokens);
  }

  async deleteById(id: string) {
    await this.prisma.refreshToken.deleteMany({ where: { id } });
  }

  async deleteAllOldTokens(date: Date) {
    const deletedResult = await this.prisma.refreshToken.deleteMany({
      where: {
        expires_date: {
          lte: date,
        },
      },
    });

    return deletedResult;
  }

  async deleteByRefreshToken(refresh_token: string) {
    await this.prisma.refreshToken.deleteMany({ where: { refresh_token } });
  }
}
