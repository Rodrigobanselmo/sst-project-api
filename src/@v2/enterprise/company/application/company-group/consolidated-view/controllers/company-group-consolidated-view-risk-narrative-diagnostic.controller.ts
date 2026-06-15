import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

import { CompanyRoutes } from '@/@v2/enterprise/company/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import { CompanyGroupConsolidatedViewPath } from './company-group-consolidated-view.path';
import { CompanyGroupConsolidatedViewRiskNarrativeDiagnosticBody } from './company-group-consolidated-view-risk-narrative-diagnostic.body';
import { CompanyGroupConsolidatedViewRiskNarrativeDiagnosticQuery } from './company-group-consolidated-view-risk-narrative-diagnostic.query';
import { CompanyGroupConsolidatedViewRiskNarrativeDiagnosticGenerateUseCase } from '../use-cases/company-group-consolidated-view-risk-narrative-diagnostic-generate.usecase';
import { CompanyGroupConsolidatedViewRiskNarrativeDiagnosticReadUseCase } from '../use-cases/company-group-consolidated-view-risk-narrative-diagnostic-read.usecase';
import {
  ConsolidatedRiskNarrativeGroupingMode,
  normalizeConsolidatedRiskNarrativeScope,
} from '../utils/consolidated-risk-narrative-scope.types';

@Controller(CompanyRoutes.COMPANY_GROUP.CONSOLIDATED_VIEW_RISK_NARRATIVE_DIAGNOSTIC)
@UseGuards(JwtAuthGuard)
export class CompanyGroupConsolidatedViewRiskNarrativeDiagnosticController {
  constructor(
    private readonly generateUseCase: CompanyGroupConsolidatedViewRiskNarrativeDiagnosticGenerateUseCase,
    private readonly readUseCase: CompanyGroupConsolidatedViewRiskNarrativeDiagnosticReadUseCase,
  ) {}

  @Post()
  @Permissions({
    code: PermissionEnum.COMPANY,
    crud: 'u',
  })
  generate(
    @Param() path: CompanyGroupConsolidatedViewPath,
    @Body() body: CompanyGroupConsolidatedViewRiskNarrativeDiagnosticBody,
    @User() user: UserPayloadDto,
  ) {
    return this.generateUseCase.execute({
      companyGroupId: path.companyGroupId,
      applicationIds: body.applicationIds,
      scope: normalizeConsolidatedRiskNarrativeScope({
        groupingMode: body.scope.groupingMode as
          | ConsolidatedRiskNarrativeGroupingMode
          | undefined,
        filters: body.scope.filters,
      }),
      customPrompt: body.customPrompt,
      model: body.model,
      regenerate: body.regenerate,
      user,
    });
  }

  @Get()
  @Permissions({
    code: PermissionEnum.COMPANY,
    crud: 'r',
  })
  read(
    @Param() path: CompanyGroupConsolidatedViewPath,
    @Query() query: CompanyGroupConsolidatedViewRiskNarrativeDiagnosticQuery,
    @User() user: UserPayloadDto,
  ) {
    return this.readUseCase.execute({
      companyGroupId: path.companyGroupId,
      applicationIds: query.applicationIds,
      scopeKey: query.scopeKey,
      scope: normalizeConsolidatedRiskNarrativeScope({
        groupingMode: query.groupingMode as
          | ConsolidatedRiskNarrativeGroupingMode
          | undefined,
        filters: {
          companyId: query.companyId,
          formApplicationId: query.formApplicationId,
          riskLevel: query.riskLevel,
          status: query.status,
          search: query.search,
        },
      }),
      user,
    });
  }
}
