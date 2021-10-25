import { Body, Controller, Delete, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Public } from '../../../shared/decorators/public.decorator';
import { LoginUserDto } from '../dto/login-user.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { DeleteAllExpiredService } from '../services/delete-all-expired/delete-all-expired.service';
import { RefreshTokenService } from '../services/refresh-token/refresh-token.service';
import { SessionService } from '../services/session/session.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly deleteAllExpiredRefreshTokensService: DeleteAllExpiredService,
  ) {}

  @Public()
  @Post('session')
  session(@Body() loginUserDto: LoginUserDto) {
    return this.sessionService.execute(loginUserDto);
  }

  @Public()
  @Post('refresh')
  refresh(@Body() { refresh_token }: RefreshTokenDto) {
    return this.refreshTokenService.execute(refresh_token);
  }

  @Delete('expired-refresh-tokens')
  @ApiBearerAuth()
  deleteAll() {
    return this.deleteAllExpiredRefreshTokensService.execute();
  }
}
