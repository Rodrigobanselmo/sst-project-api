import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { ReadFormApplicationUseCase } from '../use-cases/read-form-application.usecase';
import { Public } from '@/@v2/shared/decorators/metadata/public.decorator';
import { FormRoutes } from '@/@v2/enterprise/document-control/constants/routes';
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
