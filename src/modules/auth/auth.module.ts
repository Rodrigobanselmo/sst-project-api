import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DayJSProvider } from '../../shared/providers/DateProvider/implementations/DayJSProvider';
import { HashProvider } from '../../shared/providers/HashProvider/implementations/HashProvider';
import { TokenProvider } from '../../shared/providers/TokenProvider/implementations/JwtTokenProvider';
import { UsersRepository } from '../users/repositories/implementations/UsersRepository';

import { AuthController } from './controller/auth.controller';
import { RefreshTokensRepository } from './repositories/implementations/RefreshTokensRepository';
import { DeleteAllExpiredService } from './services/delete-all-expired/delete-all-expired.service';
import { RefreshTokenService } from './services/refresh-token/refresh-token.service';
import { SessionService } from './services/session/session.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.TOKEN_SECRET,
      signOptions: {
        expiresIn: process.env.TOKEN_EXPIRES,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    SessionService,
    RefreshTokenService,
    DeleteAllExpiredService,
    UsersRepository,
    HashProvider,
    DayJSProvider,
    RefreshTokensRepository,
    TokenProvider,
    JwtStrategy,
  ],
})
export class AuthModule {}
