import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { DayJSProvider } from '../../shared/providers/DateProvider/implementations/DayJSProvider';
import { FirebaseProvider } from '../../shared/providers/FirebaseProvider/FirebaseProvider';
import { HashProvider } from '../../shared/providers/HashProvider/implementations/HashProvider';
import { JwtTokenProvider } from '../../shared/providers/TokenProvider/implementations/JwtTokenProvider';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controller/session/auth.controller';
import { AuthorizationTestController } from './controller/authorization-test/authorization-test.controller';
import { RefreshTokensRepository } from './repositories/implementations/RefreshTokensRepository';
import { DeleteAllExpiredService } from './services/session/delete-all-expired/delete-all-expired.service';
import { RefreshTokenService } from './services/session/refresh-token/refresh-token.service';
import { SendForgotPassMailService } from './services/session/send-forgot-pass-mail/send-forgot-pass-mail.service';
import { SessionService } from './services/session/session/session.service';
import { VerifyGoogleLoginService } from './services/session/verify-google-login/verify-google-login.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthGroupRepository } from './repositories/implementations/AuthGroupRepository';
import { FindAvailableAccessGroupsService } from './services/group/find-available-access-group/upsert-access-group.service';
import { UpsertAccessGroupsService } from './services/group/upsert-access-group/upsert-access-group.service';
import { AuthGroupController } from './controller/group/group.controller';
import { NodeMailProvider } from '../../shared/providers/MailProvider/implementations/NodeMail/NodeMailProvider';

@Module({
  imports: [
    CacheModule.register(),
    PassportModule,
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.TOKEN_SECRET,
      signOptions: {
        expiresIn: process.env.TOKEN_EXPIRES,
      },
    }),
  ],
  controllers: [AuthController, AuthorizationTestController, AuthGroupController],
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
    NodeMailProvider,
    VerifyGoogleLoginService,
    FirebaseProvider,
    AuthGroupRepository,
    FindAvailableAccessGroupsService,
    UpsertAccessGroupsService,
  ],
  exports: [SessionService, AuthGroupRepository],
})
export class AuthModule { }
