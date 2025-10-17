import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { CharacterizationRoutes } from '@/@v2/security/characterization/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { AiAnalyzeCharacterizationUseCase } from '../use-cases/ai-analyze-characterization.usecase';
import { AiAnalyzeCharacterizationPath } from './ai-analyze-characterization.path';
import { AiAnalyzeCharacterizationPayload } from './ai-analyze-characterization.payload';

@Controller(CharacterizationRoutes.CHARACTERIZATION.AI_ANALYZE)
@UseGuards(JwtAuthGuard)
export class AiAnalyzeCharacterizationController {
  constructor(private readonly aiAnalyzeCharacterizationUseCase: AiAnalyzeCharacterizationUseCase) {}

  @Post()
  @Permissions({
    code: PermissionEnum.CHARACTERIZATION,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async analyzeCharacterization(@Param() path: AiAnalyzeCharacterizationPath, @Body() body: AiAnalyzeCharacterizationPayload) {
    const response = await this.aiAnalyzeCharacterizationUseCase.execute({
      companyId: path.companyId,
      workspaceId: path.workspaceId,
      characterizationId: path.characterizationId,
      customPrompt: body.customPrompt,
      model: body.model, // Pass the optional model parameter
    });

    console.log({ response });

    return response;
  }
}
