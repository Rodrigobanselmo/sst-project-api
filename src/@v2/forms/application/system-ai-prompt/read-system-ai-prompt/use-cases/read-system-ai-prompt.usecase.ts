import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { LocalContext } from '@/@v2/shared/adapters/context';
import { SystemAiPromptRepository } from '@/@v2/forms/database/repositories/system-ai-prompt/system-ai-prompt.repository';
import { SystemAiPromptKeyEnum } from '../../constants/system-ai-prompt-key.enum';
import {
  getSystemAiPromptDefaultContent,
  isValidSystemAiPromptKey,
  toPrismaSystemAiPromptKey,
} from '../../shared/system-ai-prompt-defaults';
import { requireSystemMaster } from '../../shared/require-system-master.util';
import { IReadSystemAiPromptUseCase } from './read-system-ai-prompt.types';

@Injectable()
export class ReadSystemAiPromptUseCase {
  constructor(
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly systemAiPromptRepository: SystemAiPromptRepository,
  ) {}

  async execute(params: IReadSystemAiPromptUseCase.Params): Promise<IReadSystemAiPromptUseCase.Result> {
    requireSystemMaster(this.context);

    if (!isValidSystemAiPromptKey(params.key)) {
      throw new BadRequestException('Chave de prompt inválida.');
    }

    const persisted = await this.systemAiPromptRepository.findByKey(toPrismaSystemAiPromptKey(params.key));

    if (persisted) {
      return {
        key: params.key,
        content: persisted.content,
        revision: persisted.revision,
        updatedBy: persisted.updatedBy,
        updatedAt: persisted.updated_at.toISOString(),
        isPersistedDefault: true,
      };
    }

    return {
      key: params.key,
      content: getSystemAiPromptDefaultContent(params.key),
      revision: 0,
      updatedBy: null,
      updatedAt: new Date(0).toISOString(),
      isPersistedDefault: false,
    };
  }
}
