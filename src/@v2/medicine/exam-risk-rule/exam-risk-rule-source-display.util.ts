import {
  PcmsoExamRiskRuleSourceEnum,
} from '@prisma/client';

export type AcgihBeiOriginInfo = {
  acgihBeiIndicatorId: string;
  substanceName: string | null;
};

export type ExamRiskRuleSourceDisplay = {
  sourceDisplayLabel: string;
  sourceOriginType:
    | 'NR_07'
    | 'ACGIH_BEI'
    | 'TECHNICAL'
    | 'SIMPLE_SST'
    | 'OTHER'
    | null;
  sourceOriginId: string | null;
};

/** Extrai o ID do indicador oficial ACGIH a partir da chave idempotente da regra. */
export const parseAcgihOfficialIndicatorId = (
  sourceIndicatorId: string | null | undefined,
): string | null => {
  const trimmed = sourceIndicatorId?.trim();
  if (!trimmed) return null;
  return trimmed.split('::')[0] || null;
};

const SOURCE_LABELS: Record<PcmsoExamRiskRuleSourceEnum, string> = {
  [PcmsoExamRiskRuleSourceEnum.NR_07]: 'NR-07',
  [PcmsoExamRiskRuleSourceEnum.SIMPLE_SST]: 'SimpleSST',
  [PcmsoExamRiskRuleSourceEnum.TECHNICAL]: 'Critério técnico',
  [PcmsoExamRiskRuleSourceEnum.OTHER]: 'Outro',
};

export const resolveExamRiskRuleSourceDisplay = (params: {
  source: PcmsoExamRiskRuleSourceEnum;
  sourceIndicatorId: string | null;
  acgihOrigin?: AcgihBeiOriginInfo | null;
}): ExamRiskRuleSourceDisplay => {
  if (params.source === PcmsoExamRiskRuleSourceEnum.NR_07) {
    return {
      sourceDisplayLabel: 'NR-07',
      sourceOriginType: 'NR_07',
      sourceOriginId: params.sourceIndicatorId,
    };
  }

  if (
    params.source === PcmsoExamRiskRuleSourceEnum.TECHNICAL &&
    params.acgihOrigin?.acgihBeiIndicatorId
  ) {
    return {
      sourceDisplayLabel: 'ACGIH/BEI',
      sourceOriginType: 'ACGIH_BEI',
      sourceOriginId: params.acgihOrigin.acgihBeiIndicatorId,
    };
  }

  if (params.source === PcmsoExamRiskRuleSourceEnum.TECHNICAL) {
    return {
      sourceDisplayLabel: 'Critério técnico',
      sourceOriginType: 'TECHNICAL',
      sourceOriginId: null,
    };
  }

  if (params.source === PcmsoExamRiskRuleSourceEnum.SIMPLE_SST) {
    return {
      sourceDisplayLabel: 'SimpleSST',
      sourceOriginType: 'SIMPLE_SST',
      sourceOriginId: null,
    };
  }

  return {
    sourceDisplayLabel: SOURCE_LABELS[params.source] ?? 'Outro',
    sourceOriginType: 'OTHER',
    sourceOriginId: null,
  };
};
