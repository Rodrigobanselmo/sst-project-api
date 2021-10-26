import { Injectable, UnauthorizedException } from '@nestjs/common';
import { classToClass } from 'class-transformer';

import { UsersRepository } from '../../../../modules/users/repositories/implementations/UsersRepository';
import { JwtTokenProvider } from '../../../../shared/providers/TokenProvider/implementations/JwtTokenProvider';
import { PayloadTokenDto } from '../../dto/payload-token.dto';
import { RefreshTokensRepository } from '../../repositories/implementations/RefreshTokensRepository';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly jwtTokenProvider: JwtTokenProvider,
  ) {}

  async execute(refresh_token: string) {
    const sub = this.jwtTokenProvider.verifyIsValidToken(
      refresh_token,
      'refresh',
    );

    if (sub === 'expired') {
      await this.refreshTokensRepository.deleteByRefreshToken(refresh_token);
      throw new UnauthorizedException('jwt expired');
    }

    const userId = Number(sub);

    const userRefreshToken =
      await this.refreshTokensRepository.findByUserIdAndRefreshToken(
        userId,
        refresh_token,
      );

    if (!userRefreshToken) {
      throw new UnauthorizedException('Refresh Token does not exists!');
    }

    const user = await this.usersRepository.findById(userId);

    const payloadToken: PayloadTokenDto = {
      email: user.email,
      sub: user.id,
      roles: user.roles,
      permissions: user.permissions,
    };

    const token = this.jwtTokenProvider.generateToken(payloadToken);
    const [new_refresh_token, refreshTokenExpiresDate] =
      this.jwtTokenProvider.generateRefreshToken(user.id);

    const refreshToken = await this.refreshTokensRepository.create(
      new_refresh_token,
      user.id,
      refreshTokenExpiresDate,
    );

    await this.refreshTokensRepository.deleteById(userRefreshToken.id);

    return {
      refresh_token: refreshToken.refresh_token,
      token: token,
      user: classToClass(user),
    };
  }
}
