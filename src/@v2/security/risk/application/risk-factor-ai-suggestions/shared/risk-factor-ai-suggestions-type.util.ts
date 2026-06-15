import { SystemAiPromptKeyEnum } from '@/@v2/forms/application/system-ai-prompt/constants/system-ai-prompt-key.enum';

export const AI_SUGGESTION_SUPPORTED_RISK_TYPES = [
  'QUI',
  'FIS',
  'BIO',
  'ERG',
  'ACI',
  'OUTROS',
] as const;

export type AiSuggestionSupportedRiskType =
  (typeof AI_SUGGESTION_SUPPORTED_RISK_TYPES)[number];

export const normalizeRiskFactorType = (type?: string): string =>
  (type ?? 'QUI').trim().toUpperCase();

export const isAiSuggestionSupportedRiskType = (
  type?: string,
): type is AiSuggestionSupportedRiskType =>
  AI_SUGGESTION_SUPPORTED_RISK_TYPES.includes(
    normalizeRiskFactorType(type) as AiSuggestionSupportedRiskType,
  );

export const resolveRiskFactorAiSuggestionPromptKey = (
  type?: string,
): SystemAiPromptKeyEnum => {
  switch (normalizeRiskFactorType(type)) {
    case 'FIS':
      return SystemAiPromptKeyEnum.RISK_FACTOR_PHYSICAL_AI_SUGGESTIONS;
    case 'BIO':
      return SystemAiPromptKeyEnum.RISK_FACTOR_BIOLOGICAL_AI_SUGGESTIONS;
    case 'ERG':
      return SystemAiPromptKeyEnum.RISK_FACTOR_ERGONOMIC_AI_SUGGESTIONS;
    case 'ACI':
      return SystemAiPromptKeyEnum.RISK_FACTOR_ACCIDENT_AI_SUGGESTIONS;
    case 'OUTROS':
      return SystemAiPromptKeyEnum.RISK_FACTOR_OTHER_AI_SUGGESTIONS;
    case 'QUI':
    default:
      return SystemAiPromptKeyEnum.RISK_FACTOR_CHEMICAL_AI_SUGGESTIONS;
  }
};
