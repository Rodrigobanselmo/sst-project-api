import { Controller, Get, Param } from '@nestjs/common';

import { FormRoutes } from '@/@v2/forms/constants/routes';
import { Public } from '@/@v2/shared/decorators/metadata/public.decorator';
import { ReadFormApplicationUseCase } from '../use-cases/read-form-application.usecase';
import { ReadFormApplicationPath } from './read-form-application.path';

@Controller(FormRoutes.FORM_APPLICATION.PATH_ID)
export class ReadFormApplicationController {
  constructor(private readonly readFormApplicationUseCase: ReadFormApplicationUseCase) {}

  @Get()
  @Public()
  async execute(@Param() path: ReadFormApplicationPath) {
    return this.readFormApplicationUseCase.execute({
      companyId: path.companyId,
      applicationId: path.applicationId,
    });
  }
}
