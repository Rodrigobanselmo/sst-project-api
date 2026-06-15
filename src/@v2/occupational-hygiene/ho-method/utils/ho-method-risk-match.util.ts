import { HoMethodRiskFactorSnapshot } from '../ho-method.types';

export type HoMethodRiskMatchConfidence = 'high' | 'low' | 'none';

export type HoMethodAgentMatchInput = {
  substanceName: string;
  cas: string | null;
  synonyms: string[];
};

export const normalizeCasForMatch = (value?: string | null): string =>
  value?.replace(/[-\s]/g, '').toLowerCase() ?? '';

export const normalizeAgentNameForMatch = (value?: string | null): string =>
  value?.trim().toLowerCase().replace(/\s+/g, ' ') ?? '';

export const expandSynonymParts = (entries: string[]): string[] => {
  const expanded = new Set<string>();

  entries.forEach((entry) => {
    const value = entry?.trim();
    if (!value) return;

    expanded.add(value);
    value.split(/[,;]/).forEach((part) => {
      const trimmed = part.trim();
      if (trimmed) expanded.add(trimmed);
    });
  });

  return Array.from(expanded);
};

export const collectAgentSearchTerms = (
  agent: HoMethodAgentMatchInput,
): string[] => {
  const terms = new Set<string>();

  if (agent.cas?.trim()) terms.add(agent.cas.trim());

  if (agent.substanceName?.trim()) terms.add(agent.substanceName.trim());

  expandSynonymParts(agent.synonyms).forEach((synonym) => terms.add(synonym));

  return Array.from(terms);
};

export const collectAgentNormalizedNames = (
  agent: HoMethodAgentMatchInput,
): string[] => {
  const names = new Set<string>();

  const substanceName = normalizeAgentNameForMatch(agent.substanceName);
  if (substanceName) names.add(substanceName);

  expandSynonymParts(agent.synonyms).forEach((synonym) => {
    const normalized = normalizeAgentNameForMatch(synonym);
    if (normalized) names.add(normalized);
  });

  return Array.from(names);
};

export const collectRiskNormalizedNames = (
  snapshot: HoMethodRiskFactorSnapshot,
): string[] => {
  const names = new Set<string>();

  const primaryName = normalizeAgentNameForMatch(snapshot.name);
  if (primaryName) names.add(primaryName);

  expandSynonymParts(snapshot.synonymous ?? []).forEach((synonym) => {
    const normalized = normalizeAgentNameForMatch(synonym);
    if (normalized) names.add(normalized);
  });

  return Array.from(names);
};

export const scoreRiskMatch = (
  agent: HoMethodAgentMatchInput,
  candidate: HoMethodRiskFactorSnapshot,
): HoMethodRiskMatchConfidence => {
  const agentCas = normalizeCasForMatch(agent.cas);
  const candidateCas = normalizeCasForMatch(candidate.cas);

  if (agentCas && candidateCas) {
    if (agentCas === candidateCas) return 'high';
    return 'low';
  }

  const agentNames = collectAgentNormalizedNames(agent);
  const candidateNames = collectRiskNormalizedNames(candidate);

  if (!agentNames.length || !candidateNames.length) return 'none';

  const hasExactNameMatch = agentNames.some((name) =>
    candidateNames.includes(name),
  );

  return hasExactNameMatch ? 'high' : 'none';
};

export const resolveBestRiskMatch = (
  agent: HoMethodAgentMatchInput,
  candidates: HoMethodRiskFactorSnapshot[],
): {
  match: HoMethodRiskFactorSnapshot | null;
  confidence: HoMethodRiskMatchConfidence;
  candidateRiskFactors: HoMethodRiskFactorSnapshot[];
} => {
  if (!candidates.length) {
    return {
      match: null,
      confidence: 'none',
      candidateRiskFactors: [],
    };
  }

  const scored = candidates.map((candidate) => ({
    candidate,
    confidence: scoreRiskMatch(agent, candidate),
  }));

  const highMatches = scored.filter((item) => item.confidence === 'high');

  if (highMatches.length === 1) {
    return {
      match: highMatches[0].candidate,
      confidence: 'high',
      candidateRiskFactors: candidates,
    };
  }

  if (highMatches.length > 1) {
    return {
      match: null,
      confidence: 'low',
      candidateRiskFactors: highMatches.map((item) => item.candidate),
    };
  }

  return {
    match: null,
    confidence: candidates.length > 0 ? 'low' : 'none',
    candidateRiskFactors: candidates,
  };
};
