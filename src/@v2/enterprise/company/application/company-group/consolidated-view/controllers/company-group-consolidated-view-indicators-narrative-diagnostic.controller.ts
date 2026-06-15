import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

import { CompanyRoutes } from '@/@v2/enterprise/company/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import { CompanyGroupConsolidatedViewPath } from './company-group-consolidated-view.path';
import { CompanyGroupConsolidatedViewIndicatorsNarrativeDiagnosticBody } from './company-group-consolidated-view-indicators-narrative-diagnostic.body';
import { CompanyGroupConsolidatedViewIndicatorsNarrativeDiagnosticQuery } from './company-group-consolidated-view-indicators-narrative-diagnostic.query';
import { CompanyGroupConsolidatedViewIndicatorsNarrativeDiagnosticGenerateUseCase } from '../use-cases/company-group-consolidated-view-indicators-narrative-diagnostic-generate.usecase';
import { CompanyGroupConsolidatedViewIndicatorsNarrativeDiagnosticReadUseCase } from '../use-cases/company-group-consolidated-view-indicators-narrative-diagnostic-read.usecase';
import {
  ConsolidatedIndicatorsNarrativeGroupingMode,
  normalizeConsolidatedIndicatorsNarrativeScope,
} from '../utils/consolidated-indicators-narrative-scope.types';

@Controller(CompanyRoutes.COMPANY_GROUP.CONSOLIDATED_VIEW_INDICATORS_NARRATIVE_DIAGNOSTIC)
@UseGuards(JwtAuthGuard)
export class CompanyGroupConsolidatedViewIndicatorsNarrativeDiagnosticController {
  constructor(
    private readonly generateUseCase: CompanyGroupConsolidatedViewIndicatorsNarrativeDiagnosticGenerateUseCase,
    private readonly readUseCase: CompanyGroupConsolidatedViewIndicatorsNarrativeDiagnosticReadUseCase,
  ) {}

  @Post()
  @Permissions({
    code: PermissionEnum.COMPANY,
    crud: 'u',
  })
  generate(
    @Param() path: CompanyGroupConsolidatedViewPath,
    @Body() body: CompanyGroupConsolidatedViewIndicatorsNarrativeDiagnosticBody,
    @User() user: UserPayloadDto,
  ) {
    return this.generateUseCase.execute({
      companyGroupId: path.companyGroupId,
      applicationIds: body.applicationIds,
      scope: normalizeConsolidatedIndicatorsNarrativeScope({
        groupingMode: body.scope.groupingMode as
          | ConsolidatedIndicatorsNarrativeGroupingMode
          | undefined,
        participantGroupIds: body.scope.participantGroupIds,
        groupingLabel: body.scope.groupingLabel,
        showOnlyGroupIndicators: body.scope.showOnlyGroupIndicators,
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
    @Query() query: CompanyGroupConsolidatedViewIndicatorsNarrativeDiagnosticQuery,
    @User() user: UserPayloadDto,
  ) {
    return this.readUseCase.execute({
      companyGroupId: path.companyGroupId,
      applicationIds: query.applicationIds,
      scopeKey: query.scopeKey,
      scope: normalizeConsolidatedIndicatorsNarrativeScope({
        groupingMode: query.groupingMode as
          | ConsolidatedIndicatorsNarrativeGroupingMode
          | undefined,
        participantGroupIds: query.participantGroupIds,
        groupingLabel: query.groupingLabel,
        showOnlyGroupIndicators: query.showOnlyGroupIndicators,
      }),
      user,
    });
  }
}
