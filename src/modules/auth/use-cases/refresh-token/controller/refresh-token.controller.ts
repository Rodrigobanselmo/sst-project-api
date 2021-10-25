import { Body, Controller, Post } from '@nestjs/common';

import { Public } from '../../../../../shared/decorators/public.decorator';
import { RefreshTokenDto } from '../../../dto/refresh-token.dto';
import { RefreshTokenService } from '../service/refresh-token.service';

@Controller('auth')
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @Public()
  @Post('refresh')
  refresh(@Body() { refresh_token }: RefreshTokenDto) {
    return this.refreshTokenService.execute(refresh_token);
  }
}
