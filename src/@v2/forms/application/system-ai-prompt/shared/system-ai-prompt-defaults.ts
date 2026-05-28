import { SystemAiPromptKeyEnum as PrismaSystemAiPromptKeyEnum } from '@prisma/client';
import { SystemAiPromptKeyEnum } from '../constants/system-ai-prompt-key.enum';
import { RISK_SOURCES_RECOMMENDATIONS_DEFAULT_PROMPT } from '../constants/risk-sources-recommendations-default-prompt.constant';
import { RISK_NARRATIVE_DIAGNOSTIC_DEFAULT_PROMPT } from '@/@v2/forms/application/form-questions-answers/risk-narrative-diagnostic/constants/risk-narrative-diagnostic-default-prompt.constant';
import { INDICATORS_NARRATIVE_DIAGNOSTIC_DEFAULT_PROMPT } from '@/@v2/forms/application/form-questions-answers/indicators-narrative-diagnostic/constants/indicators-narrative-diagnostic-default-prompt.constant';
import { INDICATORS_NARRATIVE_DIAGNOSTIC_GROUPS_ONLY_DEFAULT_PROMPT } from '@/@v2/forms/application/form-questions-answers/indicators-narrative-diagnostic/constants/indicators-narrative-diagnostic-groups-only-default-prompt.constant';
import { INDICATORS_NARRATIVE_DIAGNOSTIC_GROUPS_AND_QUESTIONS_DEFAULT_PROMPT } from '@/@v2/forms/application/form-questions-answers/indicators-narrative-diagnostic/constants/indicators-narrative-diagnostic-groups-and-questions-default-prompt.constant';

const DEFAULT_PROMPTS: Record<SystemAiPromptKeyEnum, string> = {
  [SystemAiPromptKeyEnum.RISK_SOURCES_RECOMMENDATIONS]: RISK_SOURCES_RECOMMENDATIONS_DEFAULT_PROMPT,
  [SystemAiPromptKeyEnum.RISK_NARRATIVE_DIAGNOSTIC]: RISK_NARRATIVE_DIAGNOSTIC_DEFAULT_PROMPT,
  [SystemAiPromptKeyEnum.INDICATORS_NARRATIVE_ANALYSIS]: '',
  [SystemAiPromptKeyEnum.INDICATORS_NARRATIVE_DIAGNOSTIC]: INDICATORS_NARRATIVE_DIAGNOSTIC_DEFAULT_PROMPT,
  [SystemAiPromptKeyEnum.INDICATORS_NARRATIVE_DIAGNOSTIC_GROUPS_ONLY]:
    INDICATORS_NARRATIVE_DIAGNOSTIC_GROUPS_ONLY_DEFAULT_PROMPT,
  [SystemAiPromptKeyEnum.INDICATORS_NARRATIVE_DIAGNOSTIC_GROUPS_AND_QUESTIONS]:
    INDICATORS_NARRATIVE_DIAGNOSTIC_GROUPS_AND_QUESTIONS_DEFAULT_PROMPT,
};

export const toPrismaSystemAiPromptKey = (key: SystemAiPromptKeyEnum): PrismaSystemAiPromptKeyEnum => {
  return key as PrismaSystemAiPromptKeyEnum;
};

export const getSystemAiPromptDefaultContent = (key: SystemAiPromptKeyEnum): string => {
  return DEFAULT_PROMPTS[key] ?? '';
};

export const isValidSystemAiPromptKey = (key: string): key is SystemAiPromptKeyEnum => {
  return Object.values(SystemAiPromptKeyEnum).includes(key as SystemAiPromptKeyEnum);
};
