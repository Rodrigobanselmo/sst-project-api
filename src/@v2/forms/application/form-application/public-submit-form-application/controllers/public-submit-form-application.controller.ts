import { Body, Controller, Param, Post } from '@nestjs/common';

import { FormRoutes } from '@/@v2/forms/constants/routes';
import { Public } from '@/@v2/shared/decorators/metadata/public.decorator';
import { SubmitFormApplicationUseCase } from '../use-cases/public-submit-form-application.usecase';
import { PublicSubmitFormApplicationPath } from './public-submit-form-application.path';
import { PublicSubmitFormApplicationPayload } from './public-submit-form-application.payload';

@Controller(FormRoutes.FORM_APPLICATION.PATH_PUBLIC)
export class PublicSubmitFormApplicationController {
  constructor(private readonly submitFormApplicationUseCase: SubmitFormApplicationUseCase) {}

  @Post()
  @Public()
  async submit(@Param() path: PublicSubmitFormApplicationPath, @Body() body: PublicSubmitFormApplicationPayload) {
    return this.submitFormApplicationUseCase.execute({
      applicationId: path.applicationId,
      answers: body.answers,
      timeSpent: body.timeSpent,
      employeeId: body.employeeId,
    });
  }
}
