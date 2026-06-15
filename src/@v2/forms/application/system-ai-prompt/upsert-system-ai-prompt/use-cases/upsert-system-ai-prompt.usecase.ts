import { BadRequestException, Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { LocalContext } from '@/@v2/shared/adapters/context';
import { SystemAiPromptRepository } from '@/@v2/forms/database/repositories/system-ai-prompt/system-ai-prompt.repository';
import {
  getSystemAiPromptDefaultContent,
  isValidSystemAiPromptKey,
  toPrismaSystemAiPromptKey,
} from '../../shared/system-ai-prompt-defaults';
import { requireSystemMaster } from '../../shared/require-system-master.util';
import { isSystemAiPromptEnumUnavailableError } from '../../shared/system-ai-prompt-prisma-error.util';
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

    let persisted;
    try {
      persisted = await this.systemAiPromptRepository.upsertByKey({
        key: toPrismaSystemAiPromptKey(params.key),
        content: trimmedContent,
        updatedBy: user.id,
      });
    } catch (error) {
      if (isSystemAiPromptEnumUnavailableError(error)) {
        throw new ServiceUnavailableException(
          'Configuração de IA ainda não disponível. Aplique as migrations e reinicie a API.',
        );
      }

      throw error;
    }

    return {
      key: params.key,
      content: persisted.content,
      defaultContent: getSystemAiPromptDefaultContent(params.key),
      revision: persisted.revision,
      updatedBy: persisted.updatedBy,
      updatedAt: persisted.updated_at.toISOString(),
      isPersistedDefault: true,
    };
  }
}
