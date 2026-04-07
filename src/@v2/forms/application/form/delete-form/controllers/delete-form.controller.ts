import { Controller, Delete, Param, UseGuards } from '@nestjs/common';

import { FormRoutes } from '@/@v2/forms/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { DeleteFormUseCase } from '../use-cases/delete-form.usecase';
import { DeleteFormPath } from './delete-form.path';

@Controller(FormRoutes.FORM.PATH_ID)
@UseGuards(JwtAuthGuard)
export class DeleteFormController {
  constructor(private readonly deleteFormUseCase: DeleteFormUseCase) {}

  @Delete()
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async delete(@Param() path: DeleteFormPath) {
    await this.deleteFormUseCase.execute({
      companyId: path.companyId,
      formId: path.formId,
    });
  }
}
