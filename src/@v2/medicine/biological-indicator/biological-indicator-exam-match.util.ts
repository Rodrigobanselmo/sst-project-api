import {
  BiologicalIndicatorMatchConfidenceEnum,
  BiologicalIndicatorMatchMethodEnum,
} from '@prisma/client';

import { normalizeText } from './biological-indicator-normalize.util';
import { tokenizeForFuzzyMatch } from './biological-indicator-risk-match.util';
import {
  BiologicalIndicatorExamMatchCandidate,
  BiologicalIndicatorExamSnapshot,
  BiologicalIndicatorMatchInput,
} from './biological-indicator-match.types';

const COLLECTION_MOMENT_HINTS: Record<string, string[]> = {
  AJ: ['antes da jornada', 'pre jornada', 'pré jornada', 'inicio da jornada'],
  FJ: ['final de jornada', 'final da jornada', 'pos jornada', 'pós jornada'],
  FJFS: ['final do ultimo dia', 'final da semana', 'fjfs'],
  AJFS: ['inicio da ultima jornada', 'ajfs'],
  AJ48: ['48 horas', 'aj48'],
  NC: ['nao critica', 'não critica', 'nc'],
  FS: ['4 ou 5 jornadas', 'fs'],
  AJ_FJ: ['pre e pos', 'pré e pós', 'aj-fj', 'diferenca pre e pos'],
};

const buildCandidate = (
  exam: BiologicalIndicatorExamSnapshot,
  params: Omit<
    BiologicalIndicatorExamMatchCandidate,
    'examId' | 'examName' | 'examMaterial'
  >,
): BiologicalIndicatorExamMatchCandidate => ({
  examId: exam.id,
  examName: exam.name,
  examMaterial: exam.material,
  ...params,
});

const requiresReviewForIndicator = (indicator: BiologicalIndicatorMatchInput): boolean =>
  indicator.requiresNormativeReview ||
  indicator.isSubstanceGroup ||
  indicator.tableNumber === 'QUADRO_2' ||
  indicator.indicatorType === 'IBE_SC';

const scoreExamFieldMatch = (
  indicatorValue: string,
  examValue?: string | null,
): number => {
  if (!examValue?.trim()) return 0;

  const left = normalizeText(indicatorValue);
  const right = normalizeText(examValue);

  if (!left || !right) return 0;
  if (left === right) return 10;
  if (left.includes(right) || right.includes(left)) return 7;

  const leftTokens = new Set(tokenizeForFuzzyMatch(left));
  const rightTokens = new Set(tokenizeForFuzzyMatch(right));
  let intersection = 0;
  leftTokens.forEach((token) => {
    if (rightTokens.has(token)) intersection += 1;
  });

  return intersection >= 2 ? intersection : 0;
};

const scoreCollectionMomentInInstruction = (
  collectionMoment: string,
  instruction?: string | null,
): number => {
  if (!instruction?.trim()) return 0;

  const normalizedInstruction = normalizeText(instruction);
  const hints = COLLECTION_MOMENT_HINTS[collectionMoment] ?? [];

  return hints.some((hint) => normalizedInstruction.includes(normalizeText(hint)))
    ? 4
    : 0;
};

export const matchIndicatorToExams = (
  indicator: BiologicalIndicatorMatchInput,
  exams: BiologicalIndicatorExamSnapshot[],
): BiologicalIndicatorExamMatchCandidate[] => {
  const scored = exams
    .map((exam) => {
      const nameScore = scoreExamFieldMatch(
        indicator.biologicalIndicatorNormalized,
        exam.name,
      );
      const analysesScore = scoreExamFieldMatch(
        indicator.biologicalIndicatorNormalized,
        exam.analyses,
      );
      const materialScore = scoreExamFieldMatch(
        indicator.biologicalMatrix,
        exam.material,
      );
      const momentScore = scoreCollectionMomentInInstruction(
        indicator.collectionMoment,
        exam.instruction,
      );

      const score = nameScore + analysesScore + materialScore + momentScore;

      let matchMethod: BiologicalIndicatorMatchMethodEnum =
        BiologicalIndicatorMatchMethodEnum.NAME_FUZZY;
      if (nameScore >= 10 || analysesScore >= 10) {
        matchMethod = BiologicalIndicatorMatchMethodEnum.NAME_EXACT;
      }

      return { exam, score, matchMethod };
    })
    .filter((entry) => entry.score >= 7)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) return [];

  const bestScore = scored[0].score;
  const topMatches = scored.filter((entry) => entry.score === bestScore);

  return topMatches.map((entry) =>
    buildCandidate(entry.exam, {
      matchConfidence:
        topMatches.length === 1 && bestScore >= 10
          ? BiologicalIndicatorMatchConfidenceEnum.HIGH
          : topMatches.length === 1
            ? BiologicalIndicatorMatchConfidenceEnum.PROBABLE
            : BiologicalIndicatorMatchConfidenceEnum.LOW,
      matchMethod: entry.matchMethod,
      requiresReview: requiresReviewForIndicator(indicator) || topMatches.length > 1,
      score: entry.score,
    }),
  );
};
