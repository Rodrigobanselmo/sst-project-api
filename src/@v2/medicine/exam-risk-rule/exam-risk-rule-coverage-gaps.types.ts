import {
  PcmsoExamRiskRuleReferenceSourceEnum,
  PcmsoExamRiskRuleScopeEnum,
  PcmsoExamRiskRuleSourceEnum,
  RiskFactorsEnum,
} from '@prisma/client';

export enum ExamRiskRuleCoverageStatusEnum {
  COVERED_BY_RULE = 'COVERED_BY_RULE',
  INDIRECT_BIOLOGICAL_ONLY = 'INDIRECT_BIOLOGICAL_ONLY',
  UNCOVERED = 'UNCOVERED',
}

export type CoverageGapsRiskSubType = {
  id: number;
  name: string;
};

export type CoverageGapsRiskRow = {
  id: string;
  name: string;
  type: RiskFactorsEnum;
  cas: string | null;
  esocialCode: string | null;
  subTypes: CoverageGapsRiskSubType[];
};

export type CoverageGapsActiveRuleExam = {
  examId: number | null;
  examNameSnapshot: string | null;
};

export type CoverageGapsActiveRuleReference = {
  sourceType: PcmsoExamRiskRuleReferenceSourceEnum;
  referenceLabel: string | null;
};

export type CoverageGapsActiveRule = {
  id: string;
  scope: PcmsoExamRiskRuleScopeEnum;
  source: PcmsoExamRiskRuleSourceEnum;
  riskFactorId: string | null;
  riskCategory: RiskFactorsEnum | null;
  riskSubTypeId: number | null;
  agentCas: string | null;
  agentNameNormalized: string | null;
  exams: CoverageGapsActiveRuleExam[];
  references: CoverageGapsActiveRuleReference[];
};

export type CoverageGapsBiologicalLink = {
  indicatorId: string;
  substanceName: string;
  confirmedExamCount: number;
  confirmedExamNames: string[];
};

export type CoverageGapsConfirmedBiologicalIndicator = {
  substanceName: string;
  confirmedExamNames: string[];
};

export type CoverageGapsItem = {
  riskFactorId: string;
  name: string;
  type: RiskFactorsEnum;
  cas: string | null;
  esocialCode: string | null;
  subTypes: CoverageGapsRiskSubType[];
  coverageStatus: ExamRiskRuleCoverageStatusEnum;
  coverageReasons: string[];
  matchedRuleIds: string[];
  matchedRuleScopes: PcmsoExamRiskRuleScopeEnum[];
  matchedExamNames: string[];
  hasBiologicalIndicatorCoverage: boolean;
  hasConfirmedBiologicalIndicator: boolean;
  confirmedBiologicalIndicatorCount: number;
  confirmedExamCount: number;
  confirmedBiologicalIndicators: CoverageGapsConfirmedBiologicalIndicator[];
  notes: string[];
};

export type CoverageGapsByTypeSummary = Record<RiskFactorsEnum, number>;

export type CoverageGapsSummary = {
  totalRisks: number;
  coveredByRule: number;
  uncovered: number;
  indirectBiologicalCoverageOnly: number;
  byType: CoverageGapsByTypeSummary;
};

export type CoverageGapsResult = {
  summary: CoverageGapsSummary;
  items: CoverageGapsItem[];
  page: number;
  limit: number;
  count: number;
};

export type CoverageGapsQuery = {
  page: number;
  limit: number;
  type?: RiskFactorsEnum;
  search?: string;
  coverageStatus?: ExamRiskRuleCoverageStatusEnum;
  includeIndirect?: boolean;
  onlyPcmso?: boolean;
};
