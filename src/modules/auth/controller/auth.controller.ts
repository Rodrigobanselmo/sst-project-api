import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Public } from '../../../shared/decorators/public.decorator';
import { ForgotPasswordDto } from '../dto/forgot-password';
import { LoginUserDto } from '../dto/login-user.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { DeleteAllExpiredService } from '../services/delete-all-expired/delete-all-expired.service';
import { RefreshTokenService } from '../services/refresh-token/refresh-token.service';
import { SendForgotPassMailService } from '../services/send-forgot-pass-mail/send-forgot-pass-mail.service';
import { SessionService } from '../services/session/session.service';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly sendForgotPassMailService: SendForgotPassMailService,
    private readonly deleteAllExpiredRefreshTokensService: DeleteAllExpiredService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('session')
  session(@Body() loginUserDto: LoginUserDto) {
    return this.sessionService.execute(loginUserDto);
  }

  @Public()
  @Post('refresh')
  refresh(@Body() { refresh_token }: RefreshTokenDto) {
    return this.refreshTokenService.execute(refresh_token);
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
