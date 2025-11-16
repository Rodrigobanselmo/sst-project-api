import { Body, Controller, Inject, Param, Post } from '@nestjs/common';

import { FormRoutes } from '@/@v2/forms/constants/routes';
import { Public } from '@/@v2/shared/decorators/metadata/public.decorator';
import { CryptoAdapter } from '@/@v2/shared/adapters/crypto/models/crypto.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { PublicFormParticipantLoginUseCase } from '../use-cases/public-form-participant-login.usecase';
import { PublicFormParticipantLoginPath } from './public-form-participant-login.path';
import { PublicFormParticipantLoginPayload } from './public-form-participant-login.payload';

@Controller(FormRoutes.FORM_APPLICATION.PATH_PUBLIC_LOGIN)
export class PublicFormParticipantLoginController {
  constructor(
    private readonly publicFormParticipantLoginUseCase: PublicFormParticipantLoginUseCase,
    @Inject(SharedTokens.Crypto) private readonly cryptoAdapter: CryptoAdapter,
  ) {}

  @Post()
  @Public()
  async login(@Param() path: PublicFormParticipantLoginPath, @Body() body: PublicFormParticipantLoginPayload) {
    const employee = await this.publicFormParticipantLoginUseCase.execute({
      applicationId: path.applicationId,
      cpf: body.cpf,
      birthday: body.birthday,
    });

    // Return encrypted employee ID token
    return {
      token: this.cryptoAdapter.encryptNumber(employee.id),
    };
  }
}
