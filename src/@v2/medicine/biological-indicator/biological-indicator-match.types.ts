import {
  BiologicalIndicatorMatchConfidenceEnum,
  BiologicalIndicatorMatchMethodEnum,
  BiologicalIndicatorTableEnum,
  BiologicalIndicatorTypeEnum,
} from '@prisma/client';

export type BiologicalIndicatorRiskSnapshot = {
  id: string;
  name: string;
  cas: string | null;
  synonymous: string[];
};

export type BiologicalIndicatorExamSnapshot = {
  id: number;
  name: string;
  material: string | null;
  instruction: string | null;
  analyses: string | null;
};

export type BiologicalIndicatorMatchInput = {
  id: string;
  substanceName: string;
  substanceNameNormalized: string;
  casNumbers: string[];
  biologicalIndicatorNormalized: string;
  biologicalMatrix: string;
  collectionMoment: string;
  tableNumber: BiologicalIndicatorTableEnum;
  indicatorType: BiologicalIndicatorTypeEnum;
  isSubstanceGroup: boolean;
  requiresNormativeReview: boolean;
};

export type BiologicalIndicatorRiskMatchCandidate = {
  riskFactorId: string;
  riskName: string;
  riskCas: string | null;
  matchConfidence: BiologicalIndicatorMatchConfidenceEnum;
  matchMethod: BiologicalIndicatorMatchMethodEnum;
  requiresReview: boolean;
  score: number;
};

export type BiologicalIndicatorExamMatchCandidate = {
  examId: number;
  examName: string;
  examMaterial: string | null;
  matchConfidence: BiologicalIndicatorMatchConfidenceEnum;
  matchMethod: BiologicalIndicatorMatchMethodEnum;
  requiresReview: boolean;
  score: number;
};

export type BiologicalIndicatorRiskMatchResult = {
  indicatorId: string;
  substanceName: string;
  matches: BiologicalIndicatorRiskMatchCandidate[];
  matchMethod: BiologicalIndicatorMatchMethodEnum | 'NO_RISK_MATCH';
};

export type BiologicalIndicatorExamMatchResult = {
  indicatorId: string;
  substanceName: string;
  biologicalIndicatorNormalized: string;
  matches: BiologicalIndicatorExamMatchCandidate[];
  matchMethod: BiologicalIndicatorMatchMethodEnum | 'NO_EXAM_MATCH';
};

export type BiologicalIndicatorMatchReport = {
  indicatorsAnalyzed: number;
  riskLinksCreated: number;
  riskLinksSkipped: number;
  riskLinksDeprecated?: number;
  examLinksCreated: number;
  examLinksSkipped: number;
  examLinksDeprecated?: number;
  noRiskMatch: BiologicalIndicatorRiskMatchResult[];
  noExamMatch: BiologicalIndicatorExamMatchResult[];
  ambiguousRiskMatches: BiologicalIndicatorRiskMatchResult[];
  secureCasMatches: Array<{
    indicatorId: string;
    substanceName: string;
    casNumbers: string[];
    matches: BiologicalIndicatorRiskMatchCandidate[];
  }>;
  riskByConfidence: Record<string, number>;
  riskByMethod: Record<string, number>;
  examByConfidence: Record<string, number>;
  examByMethod: Record<string, number>;
  sampleRiskMatches: Array<{
    indicatorId: string;
    substanceName: string;
    biologicalIndicatorNormalized: string;
    match: BiologicalIndicatorRiskMatchCandidate;
  }>;
  sampleExamMatches: Array<{
    indicatorId: string;
    substanceName: string;
    biologicalIndicatorNormalized: string;
    match: BiologicalIndicatorExamMatchCandidate;
  }>;
};
