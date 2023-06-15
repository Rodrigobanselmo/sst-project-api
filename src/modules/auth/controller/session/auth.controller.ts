import { Body, Controller, Delete, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Public } from '../../../../shared/decorators/public.decorator';
import { ForgotPasswordDto } from '../../dto/forgot-password';
import { LoginGoogleUserDto, LoginUserDto } from '../../dto/login-user.dto';
import { RefreshTokenDto } from '../../dto/refresh-token.dto';
import { DeleteAllExpiredService } from '../../services/session/delete-all-expired/delete-all-expired.service';
import { RefreshTokenService } from '../../services/session/refresh-token/refresh-token.service';
import { SendForgotPassMailService } from '../../services/session/send-forgot-pass-mail/send-forgot-pass-mail.service';
import { SessionService } from '../../services/session/session/session.service';
import { VerifyGoogleLoginService } from '../../services/session/verify-google-login/verify-google-login.service';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly sendForgotPassMailService: SendForgotPassMailService,
    private readonly deleteAllExpiredRefreshTokensService: DeleteAllExpiredService,
    private readonly verifyGoogleLoginService: VerifyGoogleLoginService,
  ) { }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('session')
  async session(@Body() loginUserDto: LoginUserDto) {
    return this.sessionService.execute(loginUserDto);
  }

  @Public()
  @Post('session/google')
  async google(@Body() loginUserDto: LoginGoogleUserDto) {
    const user = await this.verifyGoogleLoginService.execute(loginUserDto);

    return this.sessionService.execute({ email: user.email, userEntity: user });
  }

  @Public()
  @Post('refresh')
  refresh(@Body() { refresh_token, companyId }: RefreshTokenDto) {

    return this.refreshTokenService.execute(refresh_token, companyId);
  }

  @Public()
  @Post('forgot-password')
  forgot(@Body() { email }: ForgotPasswordDto) {
    return this.sendForgotPassMailService.execute(email);
  }

  @Delete('auth/expired-refresh-tokens')
  @ApiBearerAuth()
  deleteAll() {
    return this.deleteAllExpiredRefreshTokensService.execute();
  }
}
