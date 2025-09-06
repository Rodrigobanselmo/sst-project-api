import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { FormRoutes } from '@/@v2/forms/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { AssignRisksFormApplicationUseCase } from '../use-cases/assign-risks-form-application.usecase';
import { AssignRisksFormApplicationPath } from './assign-risks-form-application.path';
import { AssignRisksFormApplicationPayload } from './assign-risks-form-application.payload';

@Controller(FormRoutes.FORM_APPLICATION.PATH_ASSIGN_RISKS)
@UseGuards(JwtAuthGuard)
export class AssignRisksFormApplicationController {
  constructor(private readonly assignRisksFormApplicationUseCase: AssignRisksFormApplicationUseCase) {}

  @Post()
  @Permissions({
    code: PermissionEnum.FORM_PSIC,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async assignRisks(@Param() path: AssignRisksFormApplicationPath, @Body() body: AssignRisksFormApplicationPayload) {
    return this.assignRisksFormApplicationUseCase.execute({
      companyId: path.companyId,
      applicationId: path.applicationId,
      risks: body.risks,
    });
  }
}
