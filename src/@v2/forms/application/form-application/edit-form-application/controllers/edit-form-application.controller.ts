import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { FormRoutes } from '@/@v2/forms/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { EditFormApplicationUseCase } from '../use-cases/edit-form-application.usecase';
import { EditFormApplicationPath } from './edit-form-application.path';
import { EditFormApplicationPayload } from './edit-form-application.payload';

@Controller(FormRoutes.FORM_APPLICATION.PATH_ID)
@UseGuards(JwtAuthGuard)
export class EditFormApplicationController {
  constructor(private readonly editFormApplicationUseCase: EditFormApplicationUseCase) {}

  @Post()
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async add(@Param() path: EditFormApplicationPath, @Body() body: EditFormApplicationPayload) {
    return this.editFormApplicationUseCase.execute({
      companyId: path.companyId,
      name: body.name,
      applicationId: path.applicationId,
      status: body.status,
      description: body.description,
      formId: body.formId,
      hierarchyIds: body.hierarchyIds || [],
      workspaceIds: body.workspaceIds || [],
      identifier: body.identifier,
    });
  }
}
