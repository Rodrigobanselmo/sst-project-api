import { Injectable } from '@nestjs/common';
import { SystemAiPromptRepository } from '@/@v2/forms/database/repositories/system-ai-prompt/system-ai-prompt.repository';
import { SystemAiPromptKeyEnum } from '../constants/system-ai-prompt-key.enum';
import {
  getSystemAiPromptDefaultContent,
  toPrismaSystemAiPromptKey,
} from '../shared/system-ai-prompt-defaults';

export type SystemAiPromptSource = 'custom' | 'database' | 'fallback';

export type ResolvedSystemAiPrompt = {
  content: string;
  source: SystemAiPromptSource;
  revision?: number;
};

@Injectable()
export class SystemAiPromptResolverService {
  constructor(private readonly systemAiPromptRepository: SystemAiPromptRepository) {}

  async resolvePromptWithMeta(
    key: SystemAiPromptKeyEnum,
    customPrompt?: string,
  ): Promise<ResolvedSystemAiPrompt> {
    if (customPrompt?.trim()) {
      return { content: customPrompt.trim(), source: 'custom' };
    }

    const persisted = await this.systemAiPromptRepository.findByKey(toPrismaSystemAiPromptKey(key));
    if (persisted?.content?.trim()) {
      return {
        content: persisted.content.trim(),
        source: 'database',
        revision: persisted.revision,
      };
    }

    return {
      content: getSystemAiPromptDefaultContent(key),
      source: 'fallback',
    };
  }

  async resolvePrompt(key: SystemAiPromptKeyEnum, customPrompt?: string): Promise<string> {
    const resolved = await this.resolvePromptWithMeta(key, customPrompt);
    return resolved.content;
  }
}
