import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { DayJSProvider } from '../../shared/providers/DateProvider/implementations/DayJSProvider';
import { HashProvider } from '../../shared/providers/HashProvider/implementations/HashProvider';
import { TokenProvider } from '../../shared/providers/TokenProvider/implementations/JwtTokenProvider';
import { UsersRepository } from '../users/repositories/implementations/UsersRepository';
import { RefreshTokensRepository } from './repositories/implementations/RefreshTokensRepository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DeleteAllExpiredRefreshTokensController } from './use-cases/delete-all-expired-refresh-tokens/delete-all-expired-refresh-tokens.controller';
import { DeleteAllExpiredRefreshTokensService } from './use-cases/delete-all-expired-refresh-tokens/delete-all-expired-refresh-tokens.service';
import { RefreshTokenController } from './use-cases/refresh-token/refresh-token.controller';
import { RefreshTokenService } from './use-cases/refresh-token/refresh-token.service';
import { SessionController } from './use-cases/session/session.controller';
import { SessionService } from './use-cases/session/session.service';

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
  controllers: [
    SessionController,
    RefreshTokenController,
    DeleteAllExpiredRefreshTokensController,
  ],
  providers: [
    SessionService,
    DayJSProvider,
    JwtStrategy,
    HashProvider,
    TokenProvider,
    UsersRepository,
    RefreshTokensRepository,
    RefreshTokenService,
    DeleteAllExpiredRefreshTokensService,
  ],
})
export class AuthModule {}
