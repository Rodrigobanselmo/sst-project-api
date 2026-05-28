import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { FormRoutes } from '@/@v2/forms/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { ReadSystemAiPromptUseCase } from '../read-system-ai-prompt/use-cases/read-system-ai-prompt.usecase';
import { UpsertSystemAiPromptUseCase } from '../upsert-system-ai-prompt/use-cases/upsert-system-ai-prompt.usecase';
import { SystemAiPromptPath } from './system-ai-prompt.path';
import { UpsertSystemAiPromptBody } from './upsert-system-ai-prompt.body';

@Controller(FormRoutes.SYSTEM_AI_PROMPT.PATH)
@UseGuards(JwtAuthGuard)
export class SystemAiPromptController {
  constructor(
    private readonly readSystemAiPromptUseCase: ReadSystemAiPromptUseCase,
    private readonly upsertSystemAiPromptUseCase: UpsertSystemAiPromptUseCase,
  ) {}

  @Get(':key')
  async read(@Param() path: SystemAiPromptPath) {
    return this.readSystemAiPromptUseCase.execute({ key: path.key });
  }

  @Put(':key')
  async upsert(@Param() path: SystemAiPromptPath, @Body() body: UpsertSystemAiPromptBody) {
    return this.upsertSystemAiPromptUseCase.execute({
      key: path.key,
      content: body.content,
    });
  }
}
