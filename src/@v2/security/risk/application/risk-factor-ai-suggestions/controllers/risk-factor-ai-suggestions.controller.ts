import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { RiskFactorRoutes } from '@/@v2/security/risk/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import { RiskFactorAiSuggestionsPayload } from './risk-factor-ai-suggestions.payload';
import { RiskFactorAiSuggestionsUseCase } from '../use-cases/risk-factor-ai-suggestions.usecase';

@Controller(RiskFactorRoutes.RISK_FACTOR.AI_SUGGESTIONS)
@UseGuards(JwtAuthGuard)
export class RiskFactorAiSuggestionsController {
  constructor(
    private readonly riskFactorAiSuggestionsUseCase: RiskFactorAiSuggestionsUseCase,
  ) {}

  @Post()
  @Permissions({
    code: PermissionEnum.RISK,
    crud: 'r',
    isMember: true,
    isContract: true,
  })
  suggest(@Body() body: RiskFactorAiSuggestionsPayload, @User() user: UserPayloadDto) {
    return this.riskFactorAiSuggestionsUseCase.execute({
      companyId: user.targetCompanyId || user.companyId,
      type: body.type,
      name: body.name,
      cas: body.cas,
      synonyms: body.synonyms,
      unit: body.unit,
      method: body.method,
      limits: body.limits,
      knownData: body.knownData,
      sourceContext: body.sourceContext,
      customPrompt: body.customPrompt,
      model: body.model,
    });
  }
}
