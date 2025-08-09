import { Controller, Get, Param } from '@nestjs/common';

import { FormRoutes } from '@/@v2/forms/constants/routes';
import { Public } from '@/@v2/shared/decorators/metadata/public.decorator';
import { PublicFormApplicationUseCase } from '../use-cases/public-form-application.usecase';
import { PublicFormApplicationPath } from './public-form-application.path';

@Controller(FormRoutes.FORM_APPLICATION.PATH_PUBLIC)
export class PublicFormApplicationController {
  constructor(private readonly publicFormApplicationUseCase: PublicFormApplicationUseCase) {}

  @Get()
  @Public()
  async execute(@Param() path: PublicFormApplicationPath) {
    return this.publicFormApplicationUseCase.execute({
      applicationId: path.applicationId,
    });
  }
}
