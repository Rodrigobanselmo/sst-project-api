import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { FormRoutes } from '@/@v2/forms/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { GenerateRiskNarrativeDiagnosticUseCase } from '../generate-risk-narrative-diagnostic/use-cases/generate-risk-narrative-diagnostic.usecase';
import { ReadRiskNarrativeDiagnosticUseCase } from '../read-risk-narrative-diagnostic/use-cases/read-risk-narrative-diagnostic.usecase';
import { GenerateRiskNarrativeDiagnosticBody } from './generate-risk-narrative-diagnostic.body';
import { ReadRiskNarrativeDiagnosticQuery } from './read-risk-narrative-diagnostic.query';
import { RiskNarrativeDiagnosticPath } from './risk-narrative-diagnostic.path';

@Controller(FormRoutes.FORM_QUESTIONS_ANSWERS.RISK_NARRATIVE_DIAGNOSTIC)
@UseGuards(JwtAuthGuard)
export class RiskNarrativeDiagnosticController {
  constructor(
    private readonly generateRiskNarrativeDiagnosticUseCase: GenerateRiskNarrativeDiagnosticUseCase,
    private readonly readRiskNarrativeDiagnosticUseCase: ReadRiskNarrativeDiagnosticUseCase,
  ) {}

  @Post()
  @Permissions({
    code: PermissionEnum.FORM_PSIC,
    isContract: true,
    isMember: true,
    crud: true,
  })
  generate(@Param() path: RiskNarrativeDiagnosticPath, @Body() body: GenerateRiskNarrativeDiagnosticBody) {
    return this.generateRiskNarrativeDiagnosticUseCase.execute({
      companyId: path.companyId,
      formApplicationId: path.applicationId,
      scope: {
        groupingQuestionId: body.scope.groupingQuestionId ?? null,
        participantGroupIds: body.scope.participantGroupIds ?? [],
        allowedHierarchyIds: body.scope.allowedHierarchyIds ?? null,
        groupingLabel: body.scope.groupingLabel ?? null,
      },
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
  read(@Param() path: RiskNarrativeDiagnosticPath, @Query() query: ReadRiskNarrativeDiagnosticQuery) {
    return this.readRiskNarrativeDiagnosticUseCase.execute({
      companyId: path.companyId,
      formApplicationId: path.applicationId,
      scope: {
        groupingQuestionId: query.groupingQuestionId ?? null,
        participantGroupIds: query.participantGroupIds ?? [],
        allowedHierarchyIds: query.allowedHierarchyIds ?? null,
        groupingLabel: query.groupingLabel ?? null,
      },
    });
  }
}
