import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { DayJSProvider } from '../../shared/providers/DateProvider/implementations/DayJSProvider';
import { FirebaseProvider } from '../../shared/providers/FirebaseProvider/FirebaseProvider';
import { HashProvider } from '../../shared/providers/HashProvider/implementations/HashProvider';
import { SendGridProvider } from '../../shared/providers/MailProvider/implementations/SendGrid/SendGridProvider';
import { JwtTokenProvider } from '../../shared/providers/TokenProvider/implementations/JwtTokenProvider';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controller/auth.controller';
import { AuthorizationTestController } from './controller/authorization-test/authorization-test.controller';
import { RefreshTokensRepository } from './repositories/implementations/RefreshTokensRepository';
import { DeleteAllExpiredService } from './services/delete-all-expired/delete-all-expired.service';
import { RefreshTokenService } from './services/refresh-token/refresh-token.service';
import { SendForgotPassMailService } from './services/send-forgot-pass-mail/send-forgot-pass-mail.service';
import { SessionService } from './services/session/session.service';
import { VerifyGoogleLoginService } from './services/verify-google-login/verify-google-login.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.TOKEN_SECRET,
      signOptions: {
        expiresIn: process.env.TOKEN_EXPIRES,
      },
    }),
  ],
  controllers: [AuthController, AuthorizationTestController],
  providers: [
    SessionService,
    RefreshTokenService,
    DeleteAllExpiredService,
    HashProvider,
    DayJSProvider,
    RefreshTokensRepository,
    JwtTokenProvider,
    JwtStrategy,
    SendForgotPassMailService,
    SendGridProvider,
    VerifyGoogleLoginService,
    FirebaseProvider,
  ],
  exports: [SessionService],
})
export class AuthModule {}
