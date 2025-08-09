import { Body, Controller, Param, Patch, Put, UseGuards } from '@nestjs/common';

import { FormRoutes } from '@/@v2/forms/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { EditFormUseCase } from '../use-cases/edit-form.usecase';
import { EditFormPath } from './edit-form.path';
import { EditFormPayload } from './edit-form.payload';

@Controller(FormRoutes.FORM.PATH_ID)
@UseGuards(JwtAuthGuard)
export class EditFormController {
  constructor(private readonly editFormUseCase: EditFormUseCase) {}

  @Patch()
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async edit(@Param() path: EditFormPath, @Body() body: EditFormPayload) {
    return this.editFormUseCase.execute({
      formId: path.formId,
      companyId: path.companyId,
      name: body.name,
      description: body.description,
      type: body.type,
      anonymous: body.anonymous,
      shareableLink: body.shareableLink,
      questionGroups: body.questionGroups,
    });
  }
}
