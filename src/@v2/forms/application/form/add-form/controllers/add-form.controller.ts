import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { AddFormPath } from './add-form.path';
import { AddFormPayload } from './add-form.payload';
import { FormRoutes } from '@/@v2/forms/constants/routes';
import { AddFormUseCase } from '../use-cases/add-form.usecase';

@Controller(FormRoutes.FORM.PATH)
@UseGuards(JwtAuthGuard)
export class AddFormController {
  constructor(private readonly addFormUseCase: AddFormUseCase) {}

  @Post()
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async add(@Param() path: AddFormPath, @Body() body: AddFormPayload) {
    return this.addFormUseCase.execute({
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
