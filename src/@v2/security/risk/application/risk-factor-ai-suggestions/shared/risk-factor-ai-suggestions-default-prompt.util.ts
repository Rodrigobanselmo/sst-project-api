import { SystemAiPromptKeyEnum } from '@/@v2/forms/application/system-ai-prompt/constants/system-ai-prompt-key.enum';
import { RISK_FACTOR_CHEMICAL_AI_SUGGESTIONS_DEFAULT_PROMPT } from '../constants/risk-factor-chemical-ai-suggestions-default-prompt.constant';
import {
  RISK_FACTOR_ACCIDENT_AI_SUGGESTIONS_DEFAULT_PROMPT,
  RISK_FACTOR_BIOLOGICAL_AI_SUGGESTIONS_DEFAULT_PROMPT,
  RISK_FACTOR_ERGONOMIC_AI_SUGGESTIONS_DEFAULT_PROMPT,
  RISK_FACTOR_OTHER_AI_SUGGESTIONS_DEFAULT_PROMPT,
  RISK_FACTOR_PHYSICAL_AI_SUGGESTIONS_DEFAULT_PROMPT,
} from '../constants/risk-factor-ai-suggestions-default-prompts.constant';
import { normalizeRiskFactorType } from './risk-factor-ai-suggestions-type.util';

export const getRiskFactorAiSuggestionsDefaultPromptByType = (
  type?: string,
): string => {
  switch (normalizeRiskFactorType(type)) {
    case 'FIS':
      return RISK_FACTOR_PHYSICAL_AI_SUGGESTIONS_DEFAULT_PROMPT;
    case 'BIO':
      return RISK_FACTOR_BIOLOGICAL_AI_SUGGESTIONS_DEFAULT_PROMPT;
    case 'ERG':
      return RISK_FACTOR_ERGONOMIC_AI_SUGGESTIONS_DEFAULT_PROMPT;
    case 'ACI':
      return RISK_FACTOR_ACCIDENT_AI_SUGGESTIONS_DEFAULT_PROMPT;
    case 'OUTROS':
      return RISK_FACTOR_OTHER_AI_SUGGESTIONS_DEFAULT_PROMPT;
    case 'QUI':
    default:
      return RISK_FACTOR_CHEMICAL_AI_SUGGESTIONS_DEFAULT_PROMPT;
  }
};

export const getRiskFactorAiSuggestionsDefaultPromptByKey = (
  key: SystemAiPromptKeyEnum,
): string => {
  switch (key) {
    case SystemAiPromptKeyEnum.RISK_FACTOR_PHYSICAL_AI_SUGGESTIONS:
      return RISK_FACTOR_PHYSICAL_AI_SUGGESTIONS_DEFAULT_PROMPT;
    case SystemAiPromptKeyEnum.RISK_FACTOR_BIOLOGICAL_AI_SUGGESTIONS:
      return RISK_FACTOR_BIOLOGICAL_AI_SUGGESTIONS_DEFAULT_PROMPT;
    case SystemAiPromptKeyEnum.RISK_FACTOR_ERGONOMIC_AI_SUGGESTIONS:
      return RISK_FACTOR_ERGONOMIC_AI_SUGGESTIONS_DEFAULT_PROMPT;
    case SystemAiPromptKeyEnum.RISK_FACTOR_ACCIDENT_AI_SUGGESTIONS:
      return RISK_FACTOR_ACCIDENT_AI_SUGGESTIONS_DEFAULT_PROMPT;
    case SystemAiPromptKeyEnum.RISK_FACTOR_OTHER_AI_SUGGESTIONS:
      return RISK_FACTOR_OTHER_AI_SUGGESTIONS_DEFAULT_PROMPT;
    case SystemAiPromptKeyEnum.RISK_FACTOR_CHEMICAL_AI_SUGGESTIONS:
    default:
      return RISK_FACTOR_CHEMICAL_AI_SUGGESTIONS_DEFAULT_PROMPT;
  }
};
