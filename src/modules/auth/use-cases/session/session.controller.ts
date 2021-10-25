import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../../../../shared/decorators/public.decorator';
import { LoginUserDto } from '../../dto/login-user.dto';
import { SessionService } from './session.service';

@Controller('auth')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Public()
  @Post('session')
  session(@Body() loginUserDto: LoginUserDto) {
    return this.sessionService.execute(loginUserDto);
  }
}
