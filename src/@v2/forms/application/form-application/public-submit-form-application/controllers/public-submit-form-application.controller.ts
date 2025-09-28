import { Body, Controller, Param, Post, Inject } from '@nestjs/common';

import { FormRoutes } from '@/@v2/forms/constants/routes';
import { Public } from '@/@v2/shared/decorators/metadata/public.decorator';
import { SubmitFormApplicationUseCase } from '../use-cases/public-submit-form-application.usecase';
import { PublicSubmitFormApplicationPath } from './public-submit-form-application.path';
import { PublicSubmitFormApplicationPayload } from './public-submit-form-application.payload';
import { CryptoAdapter } from '@/@v2/shared/adapters/crypto/models/crypto.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';

@Controller(FormRoutes.FORM_APPLICATION.PATH_PUBLIC)
export class PublicSubmitFormApplicationController {
  constructor(
    private readonly submitFormApplicationUseCase: SubmitFormApplicationUseCase,
    @Inject(SharedTokens.Crypto) private readonly cryptoAdapter: CryptoAdapter,
  ) {}

  @Post()
  @Public()
  async submit(@Param() path: PublicSubmitFormApplicationPath, @Body() body: PublicSubmitFormApplicationPayload) {
    let employeeId: number | undefined;

    // If encrypted employee ID is provided, decrypt it
    if (body.encryptedEmployeeId) {
      try {
        employeeId = this.cryptoAdapter.decryptNumber(body.encryptedEmployeeId);
      } catch (error) {
        // If decryption fails, continue without employee ID (will be handled by use case)
        employeeId = undefined;
      }
    }

    return this.submitFormApplicationUseCase.execute({
      applicationId: path.applicationId,
      answers: body.answers,
      timeSpent: body.timeSpent,
      employeeId: employeeId,
    });
  }
}
