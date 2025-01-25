import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { dateUtils, ManipulateType } from '@/@v2/shared/utils/helpers/date-utils';
import { ITokenAdapter } from '../models/jwt.types';

@Injectable()
export class NestJwtAdapter implements ITokenAdapter {
  private config: {
    tokenSecret: string;
    secretRefreshToken: string;
    refreshTokenExpires: string;
  };

  constructor(private readonly jwtService: JwtService) {
    if (!process.env.TOKEN_SECRET) throw new Error('TOKEN_SECRET not defined');
    if (!process.env.REFRESH_TOKEN_SECRET) throw new Error('REFRESH_TOKEN_SECRET not defined');
    if (!process.env.REFRESH_TOKEN_EXPIRES) throw new Error('REFRESH_TOKEN_EXPIRES not defined');

    this.config = {
      tokenSecret: process.env.TOKEN_SECRET,
      secretRefreshToken: process.env.REFRESH_TOKEN_SECRET,
      refreshTokenExpires: process.env.REFRESH_TOKEN_EXPIRES,
    };
  }

  public generateToken(payload: ITokenAdapter.TokenPayload): string {
    const token = this.jwtService.sign(payload);
    return token;
  }

  public generateRefreshToken(userId: number, options?: { isApp?: boolean }): [string, Date] {
    let expiresInRefreshToken = this.config.refreshTokenExpires;
    if (options?.isApp) expiresInRefreshToken = '300h';

    const lastChar = expiresInRefreshToken.slice(-1) as ManipulateType;
    const timeValue = Number(expiresInRefreshToken.slice(0, -1));

    const refreshTokenExpiresDate = dateUtils().addTime(timeValue, lastChar);

    const refresh_token = this.jwtService.sign(
      { sub: userId },
      {
        expiresIn: expiresInRefreshToken,
        secret: this.config.secretRefreshToken,
        privateKey: this.config.secretRefreshToken,
      },
    );

    return [refresh_token, refreshTokenExpiresDate];
  }

  public verifyIsValidToken(token: string, type?: 'refresh' | 'token'): number | 'expired' | 'invalid' {
    const isRefresh = type === 'refresh';
    const secret = isRefresh ? this.config.secretRefreshToken : this.config.tokenSecret;

    try {
      const { sub }: Pick<ITokenAdapter.TokenPayload, 'sub'> = this.jwtService.verify(token, {
        secret,
        publicKey: secret,
      });
      return sub;
    } catch (err: any) {
      if (err.message === 'jwt expired') {
        return 'expired';
      }

      return 'invalid';
    }
  }
}
