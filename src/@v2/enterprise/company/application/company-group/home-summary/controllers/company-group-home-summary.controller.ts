import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { CompanyRoutes } from '@/@v2/enterprise/company/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import { CompanyGroupHomeSummaryPath } from './company-group-home-summary.path';
import { CompanyGroupHomeSummaryUseCase } from '../use-cases/company-group-home-summary.usecase';

@Controller(CompanyRoutes.COMPANY_GROUP.HOME_SUMMARY)
@UseGuards(JwtAuthGuard)
export class CompanyGroupHomeSummaryController {
  constructor(
    private readonly companyGroupHomeSummaryUseCase: CompanyGroupHomeSummaryUseCase,
  ) {}

  @Get()
  @Permissions({
    code: PermissionEnum.COMPANY,
    crud: 'r',
  })
  async execute(
    @Param() path: CompanyGroupHomeSummaryPath,
    @User() user: UserPayloadDto,
  ) {
    return this.companyGroupHomeSummaryUseCase.execute({
      companyGroupId: path.companyGroupId,
      user,
    });
  }
}
