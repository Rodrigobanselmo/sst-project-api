import type { RiskSubtypeCurationCandidateChemicalIdentity } from './chemical-identity-enrichment/chemical-identity-enrichment.types';

export type RiskSubtypeCurationSuggestConfidence = 'high' | 'medium' | 'low';

export type RiskSubtypeCurationSuggestReasonCategory =
  | 'STRUCTURAL_MATCH'
  | 'NAME_SYNONYM_MATCH'
  | 'INSUFFICIENT_DATA'
  | 'NOT_A_MATCH'
  | 'AMBIGUOUS';

export type RiskSubtypeCurationSuggestEligibleRisk = {
  id: string;
  name: string;
  cas: string | null;
  synonymous: string[];
  esocialCode: string | null;
  risk: string | null;
  symptoms: string | null;
  coments: string | null;
  method: string | null;
  nr15lt: string | null;
  twa: string | null;
  stel: string | null;
  ipvs: string | null;
  subTypes: { id: number; name: string }[];
};

export type RiskSubtypeCurationSuggestCandidate = {
  riskFactorId: string;
  name: string;
  cas: string | null;
  esocialCode: string | null;
  currentSubTypes: { id: number; name: string }[];
  suggestedInclude: boolean;
  confidence: RiskSubtypeCurationSuggestConfidence;
  rationale: string;
  warnings: string[];
  defaultSelected: boolean;
  reasonCategory?: RiskSubtypeCurationSuggestReasonCategory;
  chemicalIdentity?: RiskSubtypeCurationCandidateChemicalIdentity;
};

export type RiskSubtypeCurationSuggestResponse = {
  targetSubType: {
    id: number;
    name: string;
    description: string | null;
    type: string;
    status: string;
  };
  scope: {
    analyzed: number;
    eligibleTotal: number;
    truncated: boolean;
    onlyPcmso: boolean;
    search?: string | null;
    page: number;
    limit: number;
    hasNextPage: boolean;
    nextPage: number | null;
    rangeStart: number;
    rangeEnd: number;
    /** @deprecated Use `limit` */
    maxCandidates?: number;
  };
  summary: {
    suggestedInclude: number;
    suggestedExclude: number;
    lowConfidence: number;
    includedWithConfidence?: number;
    excludedWithConfidence?: number;
  };
  candidates: RiskSubtypeCurationSuggestCandidate[];
  warnings: string[];
  model: string;
  generatedAt: string;
  enrichment?: {
    attempted: number;
    enriched: number;
    failed: number;
    sources: ('PUBCHEM' | 'NIST' | 'NIOSH')[];
  };
};

export type RiskSubtypeCurationSuggestChunkAiItem = {
  riskFactorId: string;
  suggestedInclude: boolean;
  confidence: RiskSubtypeCurationSuggestConfidence;
  rationale: string;
  warnings: string[];
};
