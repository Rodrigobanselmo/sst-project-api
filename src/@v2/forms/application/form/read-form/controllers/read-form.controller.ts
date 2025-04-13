import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { FormRoutes } from '@/@v2/forms/constants/routes';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { ReadFormUseCase } from '../use-cases/read-form.usecase';
import { ReadFormPath } from './read-form.path';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';

@Controller(FormRoutes.FORM_APPLICATION.PATH_ID)
@UseGuards(JwtAuthGuard)
export class ReadFormController {
  constructor(private readonly readFormUseCase: ReadFormUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: ReadFormPath) {
    return this.readFormUseCase.execute({
      companyId: path.companyId,
      formId: path.formId,
    });
  }
}
