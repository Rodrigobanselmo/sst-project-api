import { UserAgent } from "./../../../../shared/decorators/userAgent.decorator";
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
} from "@nestjs/common";

import { Public } from "../../../../shared/decorators/public.decorator";
import { ForgotPasswordDto } from "../../dto/forgot-password";
import { LoginGoogleUserDto, LoginUserDto } from "../../dto/login-user.dto";
import { RefreshTokenDto } from "../../dto/refresh-token.dto";
import { DeleteAllExpiredService } from "../../services/session/delete-all-expired/delete-all-expired.service";
import { RefreshTokenService } from "../../services/session/refresh-token/refresh-token.service";
import { SendForgotPassMailService } from "../../services/session/send-forgot-pass-mail/send-forgot-pass-mail.service";
import { SessionService } from "../../services/session/session/session.service";
import { VerifyGoogleLoginService } from "../../services/session/verify-google-login/verify-google-login.service";

@Controller()
export class AuthController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly sendForgotPassMailService: SendForgotPassMailService,
    private readonly deleteAllExpiredRefreshTokensService: DeleteAllExpiredService,
    private readonly verifyGoogleLoginService: VerifyGoogleLoginService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("session")
  async session(
    @Body() loginUserDto: LoginUserDto,
    @Ip() ip: string,
    @UserAgent() userAgent: string,
  ) {
    return this.sessionService.execute(loginUserDto, ip, userAgent);
  }

  @Public()
  @Post("session/google")
  async google(
    @Body() loginUserDto: LoginGoogleUserDto,
    @Ip() ip: string,
    @UserAgent() userAgent: string,
  ) {
    const user = await this.verifyGoogleLoginService.execute(loginUserDto);

    return this.sessionService.execute(
      { email: user.email, userEntity: user },
      ip,
      userAgent,
    );
  }

  @Public()
  @Post("refresh")
  refresh(@Body() { refresh_token, companyId, isApp }: RefreshTokenDto) {
    return this.refreshTokenService.execute(refresh_token, companyId, {
      isApp,
    });
  }

  @Public()
  @Post("forgot-password")
  forgot(@Body() { email }: ForgotPasswordDto) {
    return this.sendForgotPassMailService.execute(email);
  }

  @Delete("auth/expired-refresh-tokens")
  deleteAll() {
    return this.deleteAllExpiredRefreshTokensService.execute();
  }
}
