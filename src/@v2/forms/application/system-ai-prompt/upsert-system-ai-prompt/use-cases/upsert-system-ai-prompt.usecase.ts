import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { LocalContext } from '@/@v2/shared/adapters/context';
import { SystemAiPromptRepository } from '@/@v2/forms/database/repositories/system-ai-prompt/system-ai-prompt.repository';
import {
  isValidSystemAiPromptKey,
  toPrismaSystemAiPromptKey,
} from '../../shared/system-ai-prompt-defaults';
import { requireSystemMaster } from '../../shared/require-system-master.util';
import { IUpsertSystemAiPromptUseCase } from './upsert-system-ai-prompt.types';

@Injectable()
export class UpsertSystemAiPromptUseCase {
  constructor(
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly systemAiPromptRepository: SystemAiPromptRepository,
  ) {}

  async execute(params: IUpsertSystemAiPromptUseCase.Params): Promise<IUpsertSystemAiPromptUseCase.Result> {
    const user = requireSystemMaster(this.context);

    if (!isValidSystemAiPromptKey(params.key)) {
      throw new BadRequestException('Chave de prompt inválida.');
    }

    const trimmedContent = params.content?.trim();
    if (!trimmedContent) {
      throw new BadRequestException('O conteúdo do prompt não pode ser vazio.');
    }

    const persisted = await this.systemAiPromptRepository.upsertByKey({
      key: toPrismaSystemAiPromptKey(params.key),
      content: trimmedContent,
      updatedBy: user.id,
    });

    return {
      key: params.key,
      content: persisted.content,
      revision: persisted.revision,
      updatedBy: persisted.updatedBy,
      updatedAt: persisted.updated_at.toISOString(),
      isPersistedDefault: true,
    };
  }
}
