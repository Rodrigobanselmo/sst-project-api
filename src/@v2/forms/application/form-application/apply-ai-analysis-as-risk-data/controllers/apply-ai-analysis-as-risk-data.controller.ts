import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { FormRoutes } from '@/@v2/forms/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { ApplyAiAnalysisAsRiskDataUseCase } from '../use-cases/apply-ai-analysis-as-risk-data.usecase';
import { ApplyAiAnalysisAsRiskDataPath } from './apply-ai-analysis-as-risk-data.path';
import { ApplyAiAnalysisAsRiskDataPayload } from './apply-ai-analysis-as-risk-data.payload';

@Controller(FormRoutes.FORM_APPLICATION.PATH_APPLY_AI_ANALYSIS_RISK_DATA)
@UseGuards(JwtAuthGuard)
export class ApplyAiAnalysisAsRiskDataController {
  constructor(
    private readonly applyAiAnalysisAsRiskDataUseCase: ApplyAiAnalysisAsRiskDataUseCase,
  ) {}

  @Post()
  @Permissions({
    code: PermissionEnum.FORM_PSIC,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async apply(
    @Param() path: ApplyAiAnalysisAsRiskDataPath,
    @Body() body: ApplyAiAnalysisAsRiskDataPayload,
  ) {
    return this.applyAiAnalysisAsRiskDataUseCase.execute({
      accessCompanyId: path.companyId,
      applicationId: path.applicationId,
      hierarchyId: body.hierarchyId,
      riskId: body.riskId,
      probability: body.probability,
      generateSourcesAddOnly: body.generateSourcesAddOnly,
      engsAddOnly: body.engsAddOnly,
      recAddOnly: body.recAddOnly,
      admsAddOnly: body.admsAddOnly,
    });
  }
}
