import { RISK_SUBTYPE_CURATION_SUGGEST_BASE_PROMPT } from './constants/risk-subtype-curation-suggest-base-prompt.constant';
import { RISK_SUBTYPE_CURATION_FAMILY_PROMPT_BLOCKS } from './constants/risk-subtype-curation-suggest-family-prompts.constant';
import {
  resolveRiskSubtypeCurationFamily,
  type RiskSubtypeCurationFamilyContext,
} from './risk-subtype-curation-suggest-family.util';

export function buildRiskSubtypeCurationSuggestSystemPrompt(
  subType: RiskSubtypeCurationFamilyContext,
): string {
  const family = resolveRiskSubtypeCurationFamily(subType);
  const familyBlock = RISK_SUBTYPE_CURATION_FAMILY_PROMPT_BLOCKS[family];

  return [
    RISK_SUBTYPE_CURATION_SUGGEST_BASE_PROMPT,
    '',
    `Subtipo alvo nesta execução: "${subType.name}".`,
    subType.description?.trim()
      ? `Descrição do subtipo alvo: ${subType.description.trim()}`
      : 'Descrição do subtipo alvo: (não informada)',
    '',
    familyBlock,
  ].join('\n');
}

/** Mantido para registro em system-ai-prompt-defaults (base neutro, sem bloco HC/HA global). */
export const RISK_SUBTYPE_CURATION_SUGGESTIONS_DEFAULT_PROMPT =
  RISK_SUBTYPE_CURATION_SUGGEST_BASE_PROMPT;
