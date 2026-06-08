import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { ActionPlanRoutes } from '@/@v2/security/action-plan/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { EditActionPlanEffectivenessUseCase } from '../use-cases/edit-action-plan-effectiveness.usecase';
import { EditActionPlanEffectivenessPath } from './edit-action-plan-effectiveness.path';
import { EditActionPlanEffectivenessPayload } from './edit-action-plan-effectiveness.payload';

@Controller(ActionPlanRoutes.ACTION_PLAN.EDIT_EFFECTIVENESS)
@UseGuards(JwtAuthGuard)
export class EditActionPlanEffectivenessController {
  constructor(private readonly editActionPlanEffectivenessUseCase: EditActionPlanEffectivenessUseCase) {}

  @Post()
  @Permissions({
    code: PermissionEnum.ACTION_PLAN,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async edit(@Param() path: EditActionPlanEffectivenessPath, @Body() body: EditActionPlanEffectivenessPayload) {
    return this.editActionPlanEffectivenessUseCase.execute({
      companyId: path.companyId,
      ...body,
    });
  }
}
