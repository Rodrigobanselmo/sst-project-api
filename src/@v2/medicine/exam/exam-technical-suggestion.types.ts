import { BiologicalNormativeSourceEnum } from '@prisma/client';

export type ExamTechnicalSuggestionSource = 'NR_07' | 'ACGIH_BEI' | 'MIXED' | 'NONE';

export type ExamTechnicalSuggestionResponse = {
  material?: string;
  analyses?: string;
  instruction?: string;
  source: ExamTechnicalSuggestionSource;
  shouldApply: {
    material: boolean;
    analyses: boolean;
    instruction: boolean;
  };
  notes: string[];
};

export type IndicatorTechnicalSnapshot = {
  normativeSource: BiologicalNormativeSourceEnum;
  biologicalIndicatorOriginal: string;
  biologicalMatrix: string;
  collectionMoment: string | null;
  referenceValue: string | null;
  unit: string | null;
  technicalObservationsRaw: string | null;
  samplingTime: string | null;
  notation: string | null;
  internalNotes: string | null;
  ruleCollectionMoment: string | null;
};
