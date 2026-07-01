import {
  PcmsoExamRiskRuleReferenceSourceEnum,
  PcmsoExamRiskRuleScopeEnum,
  RiskFactorsEnum,
} from '@prisma/client';

import { agentRuleMatches } from '@/modules/sst/services/exam/find-exam/exam-origin.util';
import {
  normalizeAgentName,
  normalizeCas,
} from '@/shared/utils/agent-normalize.util';

import {
  CoverageGapsActiveRule,
  CoverageGapsBiologicalLink,
  CoverageGapsItem,
  CoverageGapsRiskRow,
  CoverageGapsSummary,
  ExamRiskRuleCoverageStatusEnum,
} from './exam-risk-rule-coverage-gaps.types';

const emptyByType = (): CoverageGapsSummary['byType'] => ({
  [RiskFactorsEnum.QUI]: 0,
  [RiskFactorsEnum.FIS]: 0,
  [RiskFactorsEnum.BIO]: 0,
  [RiskFactorsEnum.ERG]: 0,
  [RiskFactorsEnum.ACI]: 0,
  [RiskFactorsEnum.OUTROS]: 0,
});

const uniqueStrings = (values: string[]): string[] => Array.from(new Set(values));

const uniqueScopes = (
  rules: CoverageGapsActiveRule[],
): PcmsoExamRiskRuleScopeEnum[] =>
  Array.from(new Set(rules.map((rule) => rule.scope)));

const collectExamNames = (rules: CoverageGapsActiveRule[]): string[] =>
  uniqueStrings(
    rules.flatMap((rule) =>
      rule.exams
        .map((exam) => exam.examNameSnapshot?.trim())
        .filter((name): name is string => Boolean(name)),
    ),
  );

const ruleMatchesRisk = (
  rule: CoverageGapsActiveRule,
  risk: CoverageGapsRiskRow,
  riskSubTypeIds: Set<number>,
  riskCasNormalized: string | null,
  riskNameNormalized: string | null,
): string | null => {
  switch (rule.scope) {
    case PcmsoExamRiskRuleScopeEnum.RISK:
      if (rule.riskFactorId === risk.id) {
        return `Regra ACTIVE escopo RISK (${rule.id})`;
      }
      return null;
    case PcmsoExamRiskRuleScopeEnum.AGENT:
      if (agentRuleMatches(rule, riskCasNormalized, riskNameNormalized)) {
        if (
          riskCasNormalized &&
          normalizeCas(rule.agentCas) === riskCasNormalized
        ) {
          return `Regra ACTIVE escopo AGENT por CAS (${rule.id})`;
        }
        return `Regra ACTIVE escopo AGENT por nome normalizado (${rule.id})`;
      }
      return null;
    case PcmsoExamRiskRuleScopeEnum.CATEGORY:
      if (rule.riskCategory === risk.type) {
        return `Regra ACTIVE escopo CATEGORY (${risk.type}, ${rule.id})`;
      }
      return null;
    case PcmsoExamRiskRuleScopeEnum.GROUP:
      if (rule.riskSubTypeId != null && riskSubTypeIds.has(rule.riskSubTypeId)) {
        return `Regra ACTIVE escopo GROUP (subtipo ${rule.riskSubTypeId}, ${rule.id})`;
      }
      return null;
    default:
      return null;
  }
};

const buildAcgihReferenceNotes = (rules: CoverageGapsActiveRule[]): string[] =>
  rules.flatMap((rule) => {
    const acgihRefs = rule.references.filter(
      (ref) => ref.sourceType === PcmsoExamRiskRuleReferenceSourceEnum.ACGIH_BEI,
    );
    if (!acgihRefs.length) return [];
    const labels = acgihRefs
      .map((ref) => ref.referenceLabel?.trim())
      .filter((label): label is string => Boolean(label));
    const suffix = labels.length ? `: ${labels.join(', ')}` : '';
    return [`Regra ${rule.id} possui referência complementar ACGIH/BEI${suffix}`];
  });

export const buildCoverageItem = (
  risk: CoverageGapsRiskRow,
  rules: CoverageGapsActiveRule[],
  biologicalLinks: CoverageGapsBiologicalLink[],
): CoverageGapsItem => {
  const riskSubTypeIds = new Set(risk.subTypes.map((subType) => subType.id));
  const riskCasNormalized = normalizeCas(risk.cas);
  const riskNameNormalized = normalizeAgentName(risk.name);

  const matchedRules: CoverageGapsActiveRule[] = [];
  const coverageReasons: string[] = [];

  for (const rule of rules) {
    const reason = ruleMatchesRisk(
      rule,
      risk,
      riskSubTypeIds,
      riskCasNormalized,
      riskNameNormalized,
    );
    if (reason) {
      matchedRules.push(rule);
      coverageReasons.push(reason);
    }
  }

  const confirmedBiologicalIndicatorCount = biologicalLinks.length;
  const confirmedExamCount = biologicalLinks.reduce(
    (total, link) => total + link.confirmedExamCount,
    0,
  );
  const hasConfirmedBiologicalIndicator = confirmedBiologicalIndicatorCount > 0;
  const hasBiologicalIndicatorCoverage =
    hasConfirmedBiologicalIndicator && confirmedExamCount > 0;

  const notes = buildAcgihReferenceNotes(matchedRules);

  let coverageStatus: ExamRiskRuleCoverageStatusEnum;
  if (matchedRules.length > 0) {
    coverageStatus = ExamRiskRuleCoverageStatusEnum.COVERED_BY_RULE;
  } else if (hasBiologicalIndicatorCoverage) {
    coverageStatus = ExamRiskRuleCoverageStatusEnum.INDIRECT_BIOLOGICAL_ONLY;
    coverageReasons.push(
      'Indicador biológico confirmado com exame confirmado (sem regra ACTIVE na Biblioteca)',
    );
  } else {
    coverageStatus = ExamRiskRuleCoverageStatusEnum.UNCOVERED;
    if (hasConfirmedBiologicalIndicator) {
      notes.push(
        'Indicador biológico confirmado sem exame confirmado — não conta como cobertura indireta',
      );
    }
  }

  return {
    riskFactorId: risk.id,
    name: risk.name,
    type: risk.type,
    cas: risk.cas,
    esocialCode: risk.esocialCode,
    subTypes: risk.subTypes,
    coverageStatus,
    coverageReasons,
    matchedRuleIds: matchedRules.map((rule) => rule.id),
    matchedRuleScopes: uniqueScopes(matchedRules),
    matchedExamNames: collectExamNames(matchedRules),
    hasBiologicalIndicatorCoverage,
    hasConfirmedBiologicalIndicator,
    confirmedBiologicalIndicatorCount,
    confirmedExamCount,
    confirmedBiologicalIndicators: biologicalLinks.map((link) => ({
      substanceName: link.substanceName,
      confirmedExamNames: link.confirmedExamNames,
    })),
    notes,
  };
};

export const buildCoverageSummary = (
  items: CoverageGapsItem[],
): CoverageGapsSummary => {
  const summary: CoverageGapsSummary = {
    totalRisks: items.length,
    coveredByRule: 0,
    uncovered: 0,
    indirectBiologicalCoverageOnly: 0,
    byType: emptyByType(),
  };

  for (const item of items) {
    summary.byType[item.type] += 1;
    switch (item.coverageStatus) {
      case ExamRiskRuleCoverageStatusEnum.COVERED_BY_RULE:
        summary.coveredByRule += 1;
        break;
      case ExamRiskRuleCoverageStatusEnum.INDIRECT_BIOLOGICAL_ONLY:
        summary.indirectBiologicalCoverageOnly += 1;
        break;
      case ExamRiskRuleCoverageStatusEnum.UNCOVERED:
        summary.uncovered += 1;
        break;
      default:
        break;
    }
  }

  return summary;
};

export const filterCoverageItems = (
  items: CoverageGapsItem[],
  params: {
    coverageStatus?: ExamRiskRuleCoverageStatusEnum;
    includeIndirect?: boolean;
  },
): CoverageGapsItem[] => {
  let filtered = items;

  if (params.includeIndirect === false) {
    filtered = filtered.filter(
      (item) =>
        item.coverageStatus !==
        ExamRiskRuleCoverageStatusEnum.INDIRECT_BIOLOGICAL_ONLY,
    );
  }

  if (params.coverageStatus) {
    filtered = filtered.filter(
      (item) => item.coverageStatus === params.coverageStatus,
    );
  }

  return filtered;
};

export const paginateCoverageItems = <T>(
  items: T[],
  page: number,
  limit: number,
): { items: T[]; count: number; page: number; limit: number } => {
  const count = items.length;
  const start = (page - 1) * limit;
  return {
    items: items.slice(start, start + limit),
    count,
    page,
    limit,
  };
};
