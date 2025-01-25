import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AuthRoutes } from '@/@v2/auth/constants/routes';
import { Public } from '@/@v2/shared/decorators/metadata/public.decorator';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { SignInUseCase } from '../use-cases/sign-in.usecase';
import { SignInPayload } from './sign-in.payload';

@Controller(AuthRoutes.SESSION.SIGN_IN)
@UseGuards(JwtAuthGuard)
export class SignInController {
  constructor(private readonly signInUseCase: SignInUseCase) {}

  @Public()
  @Post()
  async browse(@Body() body: SignInPayload) {
    return this.signInUseCase.execute({
      email: body.email || undefined,
      password: body.password || undefined,
      googleToken: body.googleToken || undefined,
      token: body.token,
    });
  }
}
