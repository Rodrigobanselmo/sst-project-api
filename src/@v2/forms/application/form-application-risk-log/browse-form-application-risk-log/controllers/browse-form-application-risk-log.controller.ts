import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { FormRoutes } from '@/@v2/forms/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { BrowseFormApplicationRiskLogUseCase } from '../use-cases/browse-form-application-risk-log.usecase';
import { BrowseFormApplicationRiskLogPath } from './browse-form-application-risk-log.path';

@Controller(FormRoutes.FORM_APPLICATION.PATH_RISK_LOGS)
@UseGuards(JwtAuthGuard)
export class BrowseFormApplicationRiskLogController {
  constructor(private readonly browseFormApplicationRiskLogUseCase: BrowseFormApplicationRiskLogUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.FORM_PSIC,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: BrowseFormApplicationRiskLogPath) {
    return this.browseFormApplicationRiskLogUseCase.execute({
      companyId: path.companyId,
      applicationId: path.applicationId,
    });
  }
}
