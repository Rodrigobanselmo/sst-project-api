import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { DayJSProvider } from '../../shared/providers/DateProvider/implementations/DayJSProvider';
import { HashProvider } from '../../shared/providers/HashProvider/implementations/HashProvider';
import { TokenProvider } from '../../shared/providers/TokenProvider/implementations/JwtTokenProvider';
import { UsersRepository } from '../users/repositories/implementations/UsersRepository';
import { RefreshTokensRepository } from './repositories/implementations/RefreshTokensRepository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DeleteAllExpiredRefreshTokensModule } from './use-cases/delete-all-expired-refresh-tokens/delete-all-expired-refresh-tokens.module';
import { RefreshTokensModule } from './use-cases/refresh-token/refresh-token.module';
import { SessionModule } from './use-cases/session/session.module';

@Module({
  imports: [
    DeleteAllExpiredRefreshTokensModule,
    RefreshTokensModule,
    PassportModule,
    SessionModule,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AuthModule {}
