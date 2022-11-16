import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { DayJSProvider } from '../../DateProvider/implementations/DayJSProvider';
import { IPayloadToken, ITokenProvider } from '../models/ITokenProvider.types';

@Injectable()
export class JwtTokenProvider implements ITokenProvider {
  constructor(private readonly jwtService: JwtService, private readonly dateProvider: DayJSProvider) {}

  public generateToken(payload: IPayloadToken): string {
    const token = this.jwtService.sign(payload);
    return token;
  }

  public generateRefreshToken(userId: number): [string, Date] {
    const secret_refresh_token = process.env.REFRESH_TOKEN_SECRET;
    const expires_in_refresh_token = process.env.REFRESH_TOKEN_EXPIRES;

    const dateNow = this.dateProvider.dateNow();
    const lastChar = expires_in_refresh_token.slice(-1);
    const timeValue = Number(expires_in_refresh_token.slice(0, -1));

    const refreshTokenExpiresDate = this.dateProvider.addTime(dateNow, timeValue, lastChar);

    const refresh_token = this.jwtService.sign(
      { sub: userId },
      {
        expiresIn: expires_in_refresh_token,
        secret: secret_refresh_token,
        privateKey: secret_refresh_token,
      },
    );

    return [refresh_token, refreshTokenExpiresDate];
  }

  public verifyIsValidToken(refresh_token: string, secret_type?: 'refresh' | 'token'): number | 'expired' | 'invalid' {
    let secret: string;

    if (secret_type === 'refresh') {
      secret = process.env.REFRESH_TOKEN_SECRET;
    } else {
      secret = process.env.TOKEN_SECRET;
    }

    try {
      const { sub }: Pick<IPayloadToken, 'sub'> = this.jwtService.verify(refresh_token, { secret, publicKey: secret });
      return sub;
    } catch (err) {
      if (err.message === 'jwt expired') {
        return 'expired';
      }
      if (err.message === 'invalid signature') {
        return 'invalid';
      }
    }
  }
}
