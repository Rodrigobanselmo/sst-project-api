import { Injectable } from '@nestjs/common';

import { SystemAiPromptKeyEnum } from '@/@v2/forms/application/system-ai-prompt/constants/system-ai-prompt-key.enum';
import { SystemAiPromptResolverService } from '@/@v2/forms/application/system-ai-prompt/services/system-ai-prompt-resolver.service';

import { RISK_SUBTYPE_CURATION_SUGGEST_MODEL } from './constants/risk-subtype-curation-suggest.constants';
import { RiskSubTypeAiInstructionRepository } from './risk-subtype-ai-instruction.repository';
import type {
  RiskSubTypeAiInstructionDraft,
  RiskSubTypeAiInstructionRecord,
} from './risk-subtype-ai-instruction.types';
import {
  assembleRiskSubtypeCurationPrompt,
  type AssembledRiskSubtypeCurationPrompt,
} from './risk-subtype-curation-ai-prompt.assembler';

export type BuildRiskSubtypeCurationPromptParams = {
  subType: {
    id: number;
    name: string;
    description: string | null;
  };
  draft?: RiskSubTypeAiInstructionDraft;
  sessionCustomPrompt?: string;
};

export type BuildRiskSubtypeCurationPromptResult = AssembledRiskSubtypeCurationPrompt & {
  selectedModel: string;
  sources: {
    globalPrompt: 'database' | 'fallback' | 'factory';
    instruction: 'database' | 'default';
    sessionCustom: boolean;
  };
  preferredModel: string | null;
};

@Injectable()
export class RiskSubtypeCurationAiPromptService {
  constructor(
    private readonly systemAiPromptResolver: SystemAiPromptResolverService,
    private readonly instructionRepository: RiskSubTypeAiInstructionRepository,
  ) {}

  createDefaultInstruction(subTypeId: number): RiskSubTypeAiInstructionRecord {
    return {
      subTypeId,
      useSystemDefault: true,
      instructions: null,
      positiveExamples: null,
      negativeExamples: null,
      cautionRules: null,
      preferredModel: null,
      revision: 0,
      updatedById: null,
      updatedAt: null,
    };
  }

  async buildPrompt(
    params: BuildRiskSubtypeCurationPromptParams,
  ): Promise<BuildRiskSubtypeCurationPromptResult> {
    const instruction =
      (await this.instructionRepository.findBySubTypeId(params.subType.id)) ??
      this.createDefaultInstruction(params.subType.id);

    const globalResolved = await this.systemAiPromptResolver.resolvePromptWithMeta(
      SystemAiPromptKeyEnum.RISK_SUBTYPE_CURATION_SUGGESTIONS,
    );

    const assembled = assembleRiskSubtypeCurationPrompt({
      subType: params.subType,
      instruction,
      draft: params.draft,
      sessionCustomPrompt: params.sessionCustomPrompt,
      globalPrompt: {
        content: globalResolved.content,
        source:
          globalResolved.source === 'database'
            ? 'database'
            : globalResolved.source === 'fallback'
              ? 'fallback'
              : 'factory',
      },
    });

    const effectivePreferredModel =
      params.draft?.preferredModel?.trim() ||
      instruction.preferredModel?.trim() ||
      null;

    return {
      ...assembled,
      selectedModel: this.resolveModel({
        sessionModel: undefined,
        preferredModel: effectivePreferredModel,
      }),
      preferredModel: effectivePreferredModel,
      sources: {
        globalPrompt:
          globalResolved.source === 'database'
            ? 'database'
            : globalResolved.source === 'fallback'
              ? 'fallback'
              : 'factory',
        instruction: instruction.revision > 0 ? 'database' : 'default',
        sessionCustom: Boolean(params.sessionCustomPrompt?.trim()),
      },
    };
  }

  resolveModel(params: {
    sessionModel?: string;
    preferredModel?: string | null;
  }): string {
    return (
      params.sessionModel?.trim() ||
      params.preferredModel?.trim() ||
      RISK_SUBTYPE_CURATION_SUGGEST_MODEL
    );
  }
}
