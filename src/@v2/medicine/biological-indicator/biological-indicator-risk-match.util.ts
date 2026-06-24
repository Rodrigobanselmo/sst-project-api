import {
  BiologicalIndicatorMatchConfidenceEnum,
  BiologicalIndicatorMatchMethodEnum,
} from '@prisma/client';

import {
  normalizeCasForMatch,
  normalizeAgentNameForMatch,
  expandSynonymParts,
} from '../../occupational-hygiene/ho-method/utils/ho-method-risk-match.util';

import { normalizeText, parseCasNumbers } from './biological-indicator-normalize.util';
import {
  BiologicalIndicatorMatchInput,
  BiologicalIndicatorRiskMatchCandidate,
  BiologicalIndicatorRiskSnapshot,
} from './biological-indicator-match.types';

const AGENT_NOISE_PATTERNS = [
  /\(\s*agente insalubre[^)]*\)/gi,
  /\(\s*agente nocivo[^)]*\)/gi,
  /\be seus compostos\b/gi,
  /\bcompostos inorg[aâ]nicos\b/gi,
];

export const normalizeRiskNameForMatch = (value?: string | null): string => {
  let stripped = (value ?? '').replace(/\s+/g, ' ').trim();

  AGENT_NOISE_PATTERNS.forEach((pattern) => {
    stripped = stripped.replace(pattern, ' ').replace(/\s+/g, ' ').trim();
  });

  return normalizeText(stripped) || normalizeAgentNameForMatch(value);
};

export const collectRiskNormalizedNames = (
  risk: BiologicalIndicatorRiskSnapshot,
): string[] => {
  const names = new Set<string>();
  const primary = normalizeRiskNameForMatch(risk.name);
  if (primary) names.add(primary);

  expandSynonymParts(risk.synonymous ?? []).forEach((synonym) => {
    const normalized = normalizeRiskNameForMatch(synonym);
    if (normalized) names.add(normalized);
  });

  return Array.from(names);
};

export const tokenizeForFuzzyMatch = (value: string): string[] =>
  normalizeText(value)
    .split(/\s+/)
    .filter((token) => token.length > 2);

export const scoreFuzzyNameMatch = (
  left: string,
  right: string,
): number => {
  const leftTokens = new Set(tokenizeForFuzzyMatch(left));
  const rightTokens = new Set(tokenizeForFuzzyMatch(right));

  if (!leftTokens.size || !rightTokens.size) return 0;

  let intersection = 0;
  leftTokens.forEach((token) => {
    if (rightTokens.has(token)) intersection += 1;
  });

  if (!intersection) {
    const leftJoined = normalizeText(left);
    const rightJoined = normalizeText(right);
    if (leftJoined.includes(rightJoined) || rightJoined.includes(leftJoined)) {
      return 3;
    }
    return 0;
  }

  return intersection;
};

export const collectNormalizedCasNumbers = (
  source: string | string[] | null | undefined,
): string[] => {
  const values = Array.isArray(source) ? source : parseCasNumbers(source);

  return values
    .map((cas) => normalizeCasForMatch(cas))
    .filter(Boolean);
};

export const hasCasIntersection = (
  indicatorCas: string | string[],
  riskCas: string | null | undefined,
): boolean => {
  const indicatorSet = new Set(collectNormalizedCasNumbers(indicatorCas));
  if (!indicatorSet.size) return false;

  return collectNormalizedCasNumbers(riskCas).some((cas) => indicatorSet.has(cas));
};

export const scoreCasIntersection = (
  indicatorCas: string | string[],
  riskCas: string | null | undefined,
): number => {
  const indicatorSet = new Set(collectNormalizedCasNumbers(indicatorCas));
  if (!indicatorSet.size) return 0;

  return collectNormalizedCasNumbers(riskCas).filter((cas) => indicatorSet.has(cas))
    .length;
};

export const scoreSubstanceNameAffinity = (
  indicatorName: string,
  riskName: string,
): number => {
  const left = normalizeText(indicatorName);
  const right = normalizeRiskNameForMatch(riskName);

  if (!left || !right) return 0;
  if (left === right) return 10;

  const variants = Array.from(
    new Set([left, left.replace(/s$/, '')].filter(Boolean)),
  );

  for (const variant of variants) {
    if (right.startsWith(variant) || right.startsWith(`${variant} `)) {
      return 9;
    }
  }

  for (const variant of variants) {
    if (right.includes(variant)) return 5;
  }

  return scoreFuzzyNameMatch(left, right);
};

const buildCandidate = (
  risk: BiologicalIndicatorRiskSnapshot,
  params: Omit<BiologicalIndicatorRiskMatchCandidate, 'riskFactorId' | 'riskName' | 'riskCas'>,
): BiologicalIndicatorRiskMatchCandidate => ({
  riskFactorId: risk.id,
  riskName: risk.name,
  riskCas: risk.cas,
  ...params,
});

const requiresReviewForIndicator = (
  indicator: BiologicalIndicatorMatchInput,
  baseRequiresReview: boolean,
): boolean =>
  indicator.requiresNormativeReview ||
  indicator.isSubstanceGroup ||
  indicator.tableNumber === 'QUADRO_2' ||
  indicator.indicatorType === 'IBE_SC' ||
  baseRequiresReview;

export const matchIndicatorToRisks = (
  indicator: BiologicalIndicatorMatchInput,
  risks: BiologicalIndicatorRiskSnapshot[],
  catalogNameAliases: Map<string, string[]> = new Map(),
): BiologicalIndicatorRiskMatchCandidate[] => {
  if (indicator.isSubstanceGroup) {
    const indicatorNames = new Set<string>([
      indicator.substanceNameNormalized,
      normalizeRiskNameForMatch(indicator.substanceName),
    ]);

    const exactNameMatches = risks.filter((risk) => {
      const riskNames = collectRiskNormalizedNames(risk);
      return riskNames.some((name) => indicatorNames.has(name));
    });

    if (exactNameMatches.length === 1) {
      return [
        buildCandidate(exactNameMatches[0], {
          matchConfidence: BiologicalIndicatorMatchConfidenceEnum.HIGH,
          matchMethod: BiologicalIndicatorMatchMethodEnum.NAME_EXACT,
          requiresReview: requiresReviewForIndicator(indicator, true),
          score: 95,
        }),
      ];
    }

    if (exactNameMatches.length > 1) {
      return exactNameMatches.map((risk) =>
        buildCandidate(risk, {
          matchConfidence: BiologicalIndicatorMatchConfidenceEnum.PROBABLE,
          matchMethod: BiologicalIndicatorMatchMethodEnum.NAME_EXACT,
          requiresReview: true,
          score: 90,
        }),
      );
    }

    const fuzzyCandidates = risks
      .map((risk) => ({
        risk,
        score: scoreFuzzyNameMatch(indicator.substanceNameNormalized, risk.name),
      }))
      .filter((entry) => entry.score >= 2)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((entry) =>
        buildCandidate(entry.risk, {
          matchConfidence: BiologicalIndicatorMatchConfidenceEnum.LOW,
          matchMethod: BiologicalIndicatorMatchMethodEnum.GROUP_RULE,
          requiresReview: true,
          score: entry.score,
        }),
      );

    return fuzzyCandidates;
  }

  const indicatorCas = collectNormalizedCasNumbers(indicator.casNumbers);

  if (indicatorCas.length) {
    const casMatches = risks
      .map((risk) => ({
        risk,
        intersectionScore: scoreCasIntersection(indicator.casNumbers, risk.cas),
        nameScore: Math.max(
          scoreSubstanceNameAffinity(indicator.substanceNameNormalized, risk.name),
          ...collectRiskNormalizedNames(risk).map((name) =>
            scoreSubstanceNameAffinity(indicator.substanceNameNormalized, name),
          ),
        ),
      }))
      .filter((entry) => entry.intersectionScore > 0);

    const bestIntersectionScore = casMatches.reduce(
      (best, entry) => Math.max(best, entry.intersectionScore),
      0,
    );
    const topCasMatches = casMatches.filter(
      (entry) => entry.intersectionScore === bestIntersectionScore,
    );

    const resolveTopCasMatches = () => {
      if (topCasMatches.length <= 1) return topCasMatches;

      const bestNameScore = topCasMatches.reduce(
        (best, entry) => Math.max(best, entry.nameScore),
        0,
      );

      if (bestNameScore < 2) return topCasMatches;

      const nameWinners = topCasMatches.filter(
        (entry) => entry.nameScore === bestNameScore,
      );

      return nameWinners.length === 1 ? nameWinners : topCasMatches;
    };

    const resolvedCasMatches = resolveTopCasMatches();

    if (resolvedCasMatches.length === 1) {
      const matchedRisk = resolvedCasMatches[0].risk;
      const riskHasMultipleCas = collectNormalizedCasNumbers(matchedRisk.cas).length > 1;

      return [
        buildCandidate(matchedRisk, {
          matchConfidence: BiologicalIndicatorMatchConfidenceEnum.HIGH,
          matchMethod:
            indicatorCas.length > 1 || riskHasMultipleCas
              ? BiologicalIndicatorMatchMethodEnum.CAS_MULTI_ANY
              : BiologicalIndicatorMatchMethodEnum.CAS_EXACT,
          requiresReview: requiresReviewForIndicator(indicator, false),
          score: 80 + resolvedCasMatches[0].intersectionScore * 5,
        }),
      ];
    }

    if (resolvedCasMatches.length > 1) {
      return resolvedCasMatches.map((entry) => {
        const riskHasMultipleCas = collectNormalizedCasNumbers(entry.risk.cas).length > 1;

        return buildCandidate(entry.risk, {
          matchConfidence: BiologicalIndicatorMatchConfidenceEnum.PROBABLE,
          matchMethod:
            indicatorCas.length > 1 || riskHasMultipleCas
              ? BiologicalIndicatorMatchMethodEnum.CAS_MULTI_ANY
              : BiologicalIndicatorMatchMethodEnum.CAS_EXACT,
          requiresReview: true,
          score: 70 + entry.intersectionScore * 5,
        });
      });
    }
  }

  const indicatorNames = new Set<string>([
    indicator.substanceNameNormalized,
    normalizeRiskNameForMatch(indicator.substanceName),
  ]);

  catalogNameAliases
    .get(indicator.substanceNameNormalized)
    ?.forEach((alias) => indicatorNames.add(normalizeRiskNameForMatch(alias)));

  const exactNameMatches = risks.filter((risk) => {
    const riskNames = collectRiskNormalizedNames(risk);
    return riskNames.some((name) => indicatorNames.has(name));
  });

  if (exactNameMatches.length === 1) {
    const method = exactNameMatches[0].synonymous?.some((synonym) =>
      indicatorNames.has(normalizeRiskNameForMatch(synonym)),
    )
      ? BiologicalIndicatorMatchMethodEnum.SYNONYM_EXACT
      : BiologicalIndicatorMatchMethodEnum.NAME_EXACT;

    return [
      buildCandidate(exactNameMatches[0], {
        matchConfidence: BiologicalIndicatorMatchConfidenceEnum.HIGH,
        matchMethod: method,
        requiresReview: requiresReviewForIndicator(indicator, false),
        score: 80,
      }),
    ];
  }

  if (exactNameMatches.length > 1) {
    return exactNameMatches.map((risk) =>
      buildCandidate(risk, {
        matchConfidence: BiologicalIndicatorMatchConfidenceEnum.PROBABLE,
        matchMethod: BiologicalIndicatorMatchMethodEnum.NAME_EXACT,
        requiresReview: true,
        score: 75,
      }),
    );
  }

  const fuzzyMatches = risks
    .map((risk) => ({
      risk,
      score: Math.max(
        scoreFuzzyNameMatch(indicator.substanceNameNormalized, risk.name),
        ...collectRiskNormalizedNames(risk).map((name) =>
          scoreFuzzyNameMatch(indicator.substanceNameNormalized, name),
        ),
      ),
    }))
    .filter((entry) => entry.score >= 2)
    .sort((a, b) => b.score - a.score);

  if (!fuzzyMatches.length) return [];

  const bestScore = fuzzyMatches[0].score;
  const topMatches = fuzzyMatches.filter((entry) => entry.score === bestScore);

  return topMatches.map((entry) =>
    buildCandidate(entry.risk, {
      matchConfidence:
        topMatches.length === 1
          ? BiologicalIndicatorMatchConfidenceEnum.PROBABLE
          : BiologicalIndicatorMatchConfidenceEnum.LOW,
      matchMethod: BiologicalIndicatorMatchMethodEnum.NAME_FUZZY,
      requiresReview: true,
      score: entry.score,
    }),
  );
};

export const buildCatalogNameAliasMap = (
  rows: Array<{ canonicalLabel: string; aliasLabel: string }>,
): Map<string, string[]> => {
  const map = new Map<string, string[]>();

  rows.forEach((row) => {
    [row.canonicalLabel, row.aliasLabel].forEach((label) => {
      const key = normalizeText(label);
      if (!key) return;

      const aliases = map.get(key) ?? [];
      aliases.push(row.canonicalLabel, row.aliasLabel);
      map.set(key, Array.from(new Set(aliases)));
    });
  });

  return map;
};
