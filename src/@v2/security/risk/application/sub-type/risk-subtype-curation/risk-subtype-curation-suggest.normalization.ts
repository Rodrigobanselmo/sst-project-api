import type { ChemicalIdentityEnrichmentResult } from './chemical-identity-enrichment/chemical-identity-enrichment.types';
import { RiskSubtypeCurationFamily } from './constants/risk-subtype-curation-suggest-family.enum';
import {
  applyExternalEnrichmentHints,
} from './risk-subtype-curation-suggest-enrichment.normalization';
import {
  applyFamilyStructuralRules,
  applyFinalGuards,
} from './risk-subtype-curation-suggest-family.normalization';
import { resolveRiskSubtypeCurationFamily } from './risk-subtype-curation-suggest-family.util';
import {
  FEN_HA_ISOCYANATE_EXCLUDE_RATIONALE,
  matchesIsocyanateCompound,
} from './risk-subtype-curation-suggest-risk-signals';
import type {
  RiskSubtypeCurationSuggestCandidate,
  RiskSubtypeCurationSuggestChunkAiItem,
  RiskSubtypeCurationSuggestEligibleRisk,
} from './risk-subtype-curation-suggest.types';

export {
  isAromaticHydrocarbonSubType,
  resolveRiskSubtypeCurationFamily,
} from './risk-subtype-curation-suggest-family.util';

export {
  isContradictoryIncludeRationale,
  isGenericWarning,
} from './risk-subtype-curation-suggest-family.normalization';

export {
  matchesAromaticAmineCompound,
  matchesAromaticNameSignal,
  matchesFenHaExcludeSignal,
  matchesIsocyanateCompound,
  matchesAliphaticHydrocarbonSignal,
  matchesNonAromaticFunctionalClass,
  matchesPhenolicCompound,
  matchesPolycyclicAromatic,
  matchesSimpleMonocyclicAromatic,
  matchesNitroAromaticNonPhenol,
  matchesNitrophenolCompound,
} from './risk-subtype-curation-suggest-risk-signals';

export function normalizeSuggestCandidate(params: {
  subTypeName: string;
  subTypeDescription?: string | null;
  risk: RiskSubtypeCurationSuggestEligibleRisk;
  ai?: RiskSubtypeCurationSuggestChunkAiItem;
  enrichment?: ChemicalIdentityEnrichmentResult;
}): RiskSubtypeCurationSuggestCandidate {
  const { subTypeName, subTypeDescription, risk, ai, enrichment } = params;
  const hasSubtype = risk.subTypes.length > 0;
  const family = resolveRiskSubtypeCurationFamily({
    name: subTypeName,
    description: subTypeDescription,
  });

  const structural = applyFamilyStructuralRules({ family, risk, ai });
  let {
    suggestedInclude,
    confidence,
    rationale,
    reasonCategory,
    structuralNameMatch,
  } = structural;
  const warnings = [...structural.warnings];

  const enriched = applyExternalEnrichmentHints({
    family,
    suggestedInclude,
    confidence,
    rationale,
    reasonCategory,
    warnings,
    enrichment,
    risk,
  });
  suggestedInclude = enriched.suggestedInclude;
  confidence = enriched.confidence;
  rationale = enriched.rationale;
  reasonCategory = enriched.reasonCategory;
  warnings.length = 0;
  warnings.push(...enriched.warnings);

  const guarded = applyFinalGuards({
    family,
    suggestedInclude,
    confidence,
    rationale,
    reasonCategory,
    structuralNameMatch,
    externalStructuralMatch: enriched.externalStructuralMatch,
  });
  suggestedInclude = guarded.suggestedInclude;
  confidence = guarded.confidence;
  rationale = guarded.rationale;
  reasonCategory = guarded.reasonCategory;

  if (
    family === RiskSubtypeCurationFamily.FEN_HA &&
    matchesIsocyanateCompound(risk)
  ) {
    suggestedInclude = false;
    confidence = 'high';
    rationale = FEN_HA_ISOCYANATE_EXCLUDE_RATIONALE;
    reasonCategory = 'NOT_A_MATCH';
  }

  const defaultSelected =
    suggestedInclude &&
    (confidence === 'high' || confidence === 'medium') &&
    !hasSubtype;

  return {
    riskFactorId: risk.id,
    name: risk.name,
    cas: risk.cas,
    esocialCode: risk.esocialCode,
    currentSubTypes: risk.subTypes.map((subType) => ({
      id: subType.id,
      name: subType.name,
    })),
    suggestedInclude,
    confidence,
    rationale,
    warnings,
    defaultSelected,
    reasonCategory,
  };
}
