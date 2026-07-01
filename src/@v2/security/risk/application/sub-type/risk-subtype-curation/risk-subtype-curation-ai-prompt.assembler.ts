import { RISK_SUBTYPE_CURATION_SUGGEST_BASE_PROMPT } from './constants/risk-subtype-curation-suggest-base-prompt.constant';
import { RISK_SUBTYPE_CURATION_FAMILY_PROMPT_BLOCKS } from './constants/risk-subtype-curation-suggest-family-prompts.constant';
import { RISK_SUBTYPE_CURATION_AI_READONLY_NOTE } from './constants/risk-subtype-curation-ai-readonly-note.constant';
import {
  resolveRiskSubtypeCurationFamily,
  type RiskSubtypeCurationFamilyContext,
} from './risk-subtype-curation-suggest-family.util';
import type {
  RiskSubTypeAiInstructionDraft,
  RiskSubTypeAiInstructionRecord,
} from './risk-subtype-ai-instruction.types';

export type AssembledPromptSectionSource =
  | 'factory'
  | 'database'
  | 'fallback'
  | 'family'
  | 'subType'
  | 'session'
  | 'fixed';

export type AssembledPromptSection = {
  name: string;
  source: AssembledPromptSectionSource;
  content: string;
};

export type AssembleRiskSubtypeCurationPromptParams = {
  subType: RiskSubtypeCurationFamilyContext & { id?: number };
  instruction?: RiskSubTypeAiInstructionRecord | null;
  draft?: RiskSubTypeAiInstructionDraft;
  sessionCustomPrompt?: string;
  globalPrompt?: {
    content: string;
    source: 'database' | 'fallback' | 'factory';
  };
};

export type AssembledRiskSubtypeCurationPrompt = {
  assembledPrompt: string;
  sections: AssembledPromptSection[];
  useSystemDefault: boolean;
  revision?: number;
};

function trimOrNull(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function effectiveInstruction(
  instruction?: RiskSubTypeAiInstructionRecord | null,
  draft?: RiskSubTypeAiInstructionDraft,
) {
  return {
    useSystemDefault: draft?.useSystemDefault ?? instruction?.useSystemDefault ?? true,
    instructions: trimOrNull(draft?.instructions ?? instruction?.instructions),
    positiveExamples: trimOrNull(draft?.positiveExamples ?? instruction?.positiveExamples),
    negativeExamples: trimOrNull(draft?.negativeExamples ?? instruction?.negativeExamples),
    cautionRules: trimOrNull(draft?.cautionRules ?? instruction?.cautionRules),
    preferredModel: trimOrNull(draft?.preferredModel ?? instruction?.preferredModel),
    revision: instruction?.revision,
  };
}

export function assembleRiskSubtypeCurationPrompt(
  params: AssembleRiskSubtypeCurationPromptParams,
): AssembledRiskSubtypeCurationPrompt {
  const sections: AssembledPromptSection[] = [];
  const effective = effectiveInstruction(params.instruction, params.draft);

  sections.push({
    name: 'Base seguro do sistema',
    source: 'factory',
    content: RISK_SUBTYPE_CURATION_SUGGEST_BASE_PROMPT.trim(),
  });

  const globalContent = params.globalPrompt?.content?.trim();
  if (globalContent && globalContent !== RISK_SUBTYPE_CURATION_SUGGEST_BASE_PROMPT.trim()) {
    sections.push({
      name: 'Prompt global configurável',
      source:
        params.globalPrompt?.source === 'database'
          ? 'database'
          : params.globalPrompt?.source === 'factory'
            ? 'factory'
            : 'fallback',
      content: globalContent,
    });
  }

  const family = resolveRiskSubtypeCurationFamily(params.subType);
  const familyBlock = RISK_SUBTYPE_CURATION_FAMILY_PROMPT_BLOCKS[family]?.trim();
  if (familyBlock) {
    sections.push({
      name: 'Bloco por família química',
      source: 'family',
      content: familyBlock,
    });
  }

  sections.push({
    name: 'Subtipo alvo',
    source: 'fixed',
    content: [
      `Subtipo alvo nesta execução: "${params.subType.name}".`,
      params.subType.description?.trim()
        ? `Descrição do subtipo alvo: ${params.subType.description.trim()}`
        : 'Descrição do subtipo alvo: (não informada)',
    ].join('\n'),
  });

  if (!effective.useSystemDefault) {
    if (effective.instructions) {
      sections.push({
        name: 'Instruções do subtipo',
        source: 'subType',
        content: effective.instructions,
      });
    }

    if (effective.positiveExamples) {
      sections.push({
        name: 'Exemplos positivos',
        source: 'subType',
        content: effective.positiveExamples,
      });
    }

    if (effective.negativeExamples) {
      sections.push({
        name: 'Exemplos negativos',
        source: 'subType',
        content: effective.negativeExamples,
      });
    }

    if (effective.cautionRules) {
      sections.push({
        name: 'Regras de cautela/ambiguidade',
        source: 'subType',
        content: effective.cautionRules,
      });
    }
  }

  const sessionCustomPrompt = trimOrNull(params.sessionCustomPrompt);
  if (sessionCustomPrompt) {
    sections.push({
      name: 'Instrução da sessão (MASTER)',
      source: 'session',
      content: sessionCustomPrompt,
    });
  }

  sections.push({
    name: 'Nota de operação',
    source: 'fixed',
    content: RISK_SUBTYPE_CURATION_AI_READONLY_NOTE,
  });

  const assembledPrompt = sections
    .map((section) => section.content.trim())
    .filter(Boolean)
    .join('\n\n');

  return {
    assembledPrompt,
    sections,
    useSystemDefault: effective.useSystemDefault,
    revision: effective.revision,
  };
}
