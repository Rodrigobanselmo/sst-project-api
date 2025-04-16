import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { FormRoutes } from '@/@v2/forms/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { AddFormApplicationUseCase } from '../use-cases/add-form-application.usecase';
import { AddFormApplicationPath } from './add-form-application.path';
import { AddFormApplicationPayload } from './add-form-application.payload';

@Controller(FormRoutes.FORM_APPLICATION.PATH)
@UseGuards(JwtAuthGuard)
export class AddFormApplicationController {
  constructor(private readonly addFormApplicationUseCase: AddFormApplicationUseCase) {}

  @Post()
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async add(@Param() path: AddFormApplicationPath, @Body() body: AddFormApplicationPayload) {
    return this.addFormApplicationUseCase.execute({
      companyId: path.companyId,
      name: body.name,
      description: body.description,
      formId: body.formId,
      hierarchyIds: body.hierarchyIds || [],
      workspaceIds: body.workspaceIds || [],
      identifier: body.identifier,
    });
  }
}
