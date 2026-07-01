import type { ChemicalIdentityEnrichmentResult } from './chemical-identity-enrichment/chemical-identity-enrichment.types';
import type {
  RiskSubtypeCurationSuggestConfidence,
  RiskSubtypeCurationSuggestReasonCategory,
} from './risk-subtype-curation-suggest.types';

const ISOCYANATE_OVERLAP_WARNING =
  'Possui relação aromática, mas o grupo isocianato é tecnicamente mais específico; avaliar subtipo Isocianatos ou subtipo combinado.';

function boostConfidence(
  current: RiskSubtypeCurationSuggestConfidence,
): RiskSubtypeCurationSuggestConfidence {
  if (current === 'low') return 'high';
  if (current === 'medium') return 'high';
  return current;
}

export function applyExternalEnrichmentHints(params: {
  aromaticSubtype: boolean;
  suggestedInclude: boolean;
  confidence: RiskSubtypeCurationSuggestConfidence;
  rationale: string;
  reasonCategory?: RiskSubtypeCurationSuggestReasonCategory;
  warnings: string[];
  enrichment?: ChemicalIdentityEnrichmentResult;
}): {
  suggestedInclude: boolean;
  confidence: RiskSubtypeCurationSuggestConfidence;
  rationale: string;
  reasonCategory?: RiskSubtypeCurationSuggestReasonCategory;
  warnings: string[];
  externalStructuralMatch: boolean;
} {
  const {
    aromaticSubtype,
    enrichment,
    warnings: initialWarnings,
  } = params;

  let {
    suggestedInclude,
    confidence,
    rationale,
    reasonCategory,
  } = params;

  const warnings = [...initialWarnings];
  let externalStructuralMatch = false;

  if (!aromaticSubtype || !enrichment) {
    return {
      suggestedInclude,
      confidence,
      rationale,
      reasonCategory,
      warnings,
      externalStructuralMatch,
    };
  }

  const pubchem = enrichment.sourceResults.find(
    (result) => result.source === 'PUBCHEM' && result.found,
  );
  if (!pubchem) {
    return {
      suggestedInclude,
      confidence,
      rationale,
      reasonCategory,
      warnings,
      externalStructuralMatch,
    };
  }

  const extConf = pubchem.confidence;
  const hints = enrichment.normalizedHints;

  if (hints.isIsocyanateHint) {
    suggestedInclude = false;
    confidence = extConf === 'high' ? 'medium' : confidence;
    rationale =
      'Fontes públicas indicam grupo isocianato; não é hidrocarboneto aromático genérico.';
    reasonCategory = 'AMBIGUOUS';
    if (!warnings.includes(ISOCYANATE_OVERLAP_WARNING)) {
      warnings.push(ISOCYANATE_OVERLAP_WARNING);
    }
    return {
      suggestedInclude,
      confidence,
      rationale,
      reasonCategory,
      warnings,
      externalStructuralMatch,
    };
  }

  if (hints.isAliphaticHint === true && extConf !== 'low') {
    if (suggestedInclude) {
      warnings.push(
        'Decisão ajustada com base em identificação química pública (alifático).',
      );
    }
    suggestedInclude = false;
    confidence = 'high';
    rationale =
      'Fontes técnicas públicas indicam hidrocarboneto alifático, sem aromaticidade.';
    reasonCategory = 'NOT_A_MATCH';
    return {
      suggestedInclude,
      confidence,
      rationale,
      reasonCategory,
      warnings,
      externalStructuralMatch,
    };
  }

  if (
    hints.classHints?.includes('non-aromatic functional group') &&
    extConf !== 'low'
  ) {
    if (suggestedInclude) {
      warnings.push(
        'Decisão ajustada com base em identificação química pública (grupo funcional não aromático).',
      );
    }
    suggestedInclude = false;
    confidence = extConf === 'high' ? 'high' : confidence;
    rationale =
      'Fontes públicas indicam grupo funcional não compatível com hidrocarboneto aromático.';
    reasonCategory = 'NOT_A_MATCH';
    return {
      suggestedInclude,
      confidence,
      rationale,
      reasonCategory,
      warnings,
      externalStructuralMatch,
    };
  }

  if (
    (hints.hasAromaticRing === true || hints.hasBenzeneRingHint === true) &&
    extConf !== 'low' &&
    !hints.isAliphaticHint
  ) {
    if (!suggestedInclude || confidence === 'low') {
      suggestedInclude = true;
      confidence = extConf === 'high' ? boostConfidence(confidence) : 'medium';
      rationale =
        'Fontes técnicas públicas (PubChem) indicam estrutura aromática compatível.';
      reasonCategory = 'STRUCTURAL_MATCH';
      externalStructuralMatch = true;
    } else if (confidence === 'medium' && extConf === 'high') {
      confidence = 'high';
      externalStructuralMatch = true;
    }
  }

  return {
    suggestedInclude,
    confidence,
    rationale,
    reasonCategory,
    warnings,
    externalStructuralMatch,
  };
}
