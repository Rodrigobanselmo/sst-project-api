import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { RefreshTokensRepository } from '../../repositories/implementations/RefreshTokensRepository';
import { UsersRepository } from './../../../..//modules/users/repositories/implementations/UsersRepository';
import { DayJSProvider } from './../../../..//shared/providers/DateProvider/implementations/DayJSProvider';
import { TokenProvider } from './../../../../shared/providers/TokenProvider/implementations/JwtTokenProvider';
import { RefreshTokenController } from './controller/refresh-token.controller';
import { RefreshTokenService } from './service/refresh-token.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.TOKEN_SECRET,
      signOptions: {
        expiresIn: process.env.TOKEN_EXPIRES,
      },
    }),
  ],
  controllers: [RefreshTokenController],
  providers: [
    UsersRepository,
    TokenProvider,
    RefreshTokenService,
    RefreshTokensRepository,
    DayJSProvider,
  ],
})
export class RefreshTokensModule {}
