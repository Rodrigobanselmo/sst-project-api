import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { DayJSProvider } from '../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { HashProvider } from '../../../../shared/providers/HashProvider/implementations/HashProvider';
import { TokenProvider } from '../../../../shared/providers/TokenProvider/implementations/JwtTokenProvider';
import { UsersRepository } from '../../../users/repositories/implementations/UsersRepository';
import { RefreshTokensRepository } from '../../repositories/implementations/RefreshTokensRepository';
import { SessionController } from './controller/session.controller';
import { SessionService } from './service/session.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.TOKEN_SECRET,
      signOptions: {
        expiresIn: process.env.TOKEN_EXPIRES,
      },
    }),
  ],
  controllers: [SessionController],
  providers: [
    UsersRepository,
    TokenProvider,
    SessionService,
    RefreshTokensRepository,
    DayJSProvider,
    HashProvider,
  ],
})
export class SessionModule {}
