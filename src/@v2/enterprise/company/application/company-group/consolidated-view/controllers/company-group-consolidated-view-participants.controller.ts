import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { CompanyRoutes } from '@/@v2/enterprise/company/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { parseOptionalBoolean } from '@/@v2/shared/utils/parse-optional-boolean.util';
import { coerceQueryStringParam } from '@/@v2/shared/utils/coerce-query-string-param.util';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import { CompanyGroupConsolidatedViewPath } from './company-group-consolidated-view.path';
import { CompanyGroupConsolidatedViewParticipantsQuery } from './company-group-consolidated-view-participants.query';
import { CompanyGroupConsolidatedViewParticipantsUseCase } from '../use-cases/company-group-consolidated-view-participants.usecase';

@Controller(CompanyRoutes.COMPANY_GROUP.CONSOLIDATED_VIEW_PARTICIPANTS)
@UseGuards(JwtAuthGuard)
export class CompanyGroupConsolidatedViewParticipantsController {
  constructor(
    private readonly companyGroupConsolidatedViewParticipantsUseCase: CompanyGroupConsolidatedViewParticipantsUseCase,
  ) {}

  @Get()
  @Permissions({
    code: PermissionEnum.COMPANY,
    crud: 'r',
  })
  async execute(
    @Param() path: CompanyGroupConsolidatedViewPath,
    @Query() query: CompanyGroupConsolidatedViewParticipantsQuery,
    @User() user: UserPayloadDto,
    @Query('search') searchRaw?: string | string[],
    @Query('hasResponded') hasRespondedRaw?: string,
  ) {
    const search = coerceQueryStringParam(searchRaw) ?? query.search;

    return this.companyGroupConsolidatedViewParticipantsUseCase.execute({
      companyGroupId: path.companyGroupId,
      applicationIds: query.applicationIds,
      search,
      hasResponded: parseOptionalBoolean(
        hasRespondedRaw ?? query.hasResponded,
      ),
      page: query.page,
      limit: query.limit,
      user,
    });
  }
}
