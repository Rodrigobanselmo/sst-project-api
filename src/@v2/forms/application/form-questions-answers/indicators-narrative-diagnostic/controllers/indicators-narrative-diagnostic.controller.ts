import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { FormRoutes } from '@/@v2/forms/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { GenerateIndicatorsNarrativeDiagnosticUseCase } from '../generate-indicators-narrative-diagnostic/use-cases/generate-indicators-narrative-diagnostic.usecase';
import { ReadIndicatorsNarrativeDiagnosticUseCase } from '../read-indicators-narrative-diagnostic/use-cases/read-indicators-narrative-diagnostic.usecase';
import { GenerateIndicatorsNarrativeDiagnosticBody } from './generate-indicators-narrative-diagnostic.body';
import { ReadIndicatorsNarrativeDiagnosticQuery } from './read-indicators-narrative-diagnostic.query';
import { IndicatorsNarrativeDiagnosticPath } from './indicators-narrative-diagnostic.path';
import { normalizeIndicatorsNarrativeDiagnosticScope } from '../shared/indicators-narrative-diagnostic-scope.types';

@Controller(FormRoutes.FORM_QUESTIONS_ANSWERS.INDICATORS_NARRATIVE_DIAGNOSTIC)
@UseGuards(JwtAuthGuard)
export class IndicatorsNarrativeDiagnosticController {
  constructor(
    private readonly generateIndicatorsNarrativeDiagnosticUseCase: GenerateIndicatorsNarrativeDiagnosticUseCase,
    private readonly readIndicatorsNarrativeDiagnosticUseCase: ReadIndicatorsNarrativeDiagnosticUseCase,
  ) {}

  @Post()
  @Permissions({
    code: PermissionEnum.FORM_PSIC,
    isContract: true,
    isMember: true,
    crud: true,
  })
  generate(
    @Param() path: IndicatorsNarrativeDiagnosticPath,
    @Body() body: GenerateIndicatorsNarrativeDiagnosticBody,
  ) {
    return this.generateIndicatorsNarrativeDiagnosticUseCase.execute({
      companyId: path.companyId,
      formApplicationId: path.applicationId,
      scope: normalizeIndicatorsNarrativeDiagnosticScope(body.scope),
      customPrompt: body.customPrompt,
      model: body.model,
      regenerate: body.regenerate,
    });
  }

  @Get()
  @Permissions({
    code: PermissionEnum.FORM_PSIC,
    isContract: true,
    isMember: true,
    crud: true,
  })
  read(
    @Param() path: IndicatorsNarrativeDiagnosticPath,
    @Query() query: ReadIndicatorsNarrativeDiagnosticQuery,
  ) {
    return this.readIndicatorsNarrativeDiagnosticUseCase.execute({
      companyId: path.companyId,
      formApplicationId: path.applicationId,
      scopeKey: query.scopeKey,
      scope: {
        groupingQuestionId: query.groupingQuestionId ?? null,
        participantGroupIds: query.participantGroupIds ?? [],
        groupingLabel: query.groupingLabel ?? null,
        showOnlyGroupIndicators: query.showOnlyGroupIndicators,
      },
    });
  }
}
