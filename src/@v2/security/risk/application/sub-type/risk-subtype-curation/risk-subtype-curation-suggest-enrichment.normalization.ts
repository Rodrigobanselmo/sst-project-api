import { RiskSubtypeCurationFamily } from './constants/risk-subtype-curation-suggest-family.enum';
import type { ChemicalIdentityEnrichmentResult } from './chemical-identity-enrichment/chemical-identity-enrichment.types';
import type {
  RiskSubtypeCurationSuggestConfidence,
  RiskSubtypeCurationSuggestEligibleRisk,
  RiskSubtypeCurationSuggestReasonCategory,
} from './risk-subtype-curation-suggest.types';
import {
  FEN_HA_ISOCYANATE_EXCLUDE_RATIONALE,
  matchesIsocyanateCompound,
  matchesNitrophenolCompound,
  matchesPhenolicCompound,
  matchesPolycyclicAromatic,
} from './risk-subtype-curation-suggest-risk-signals';

const ISOCYANATE_OVERLAP_WARNING =
  'Possui relação aromática, mas o grupo isocianato é tecnicamente mais específico; avaliar subtipo Isocianatos ou subtipo combinado.';

const MORE_SPECIFIC_SUBTYPE_WARNING =
  'O composto parece pertencer a subtipo químico mais específico que o alvo atual.';

function boostConfidence(
  current: RiskSubtypeCurationSuggestConfidence,
): RiskSubtypeCurationSuggestConfidence {
  if (current === 'low') return 'high';
  if (current === 'medium') return 'high';
  return current;
}

export function applyExternalEnrichmentHints(params: {
  family: RiskSubtypeCurationFamily;
  risk: Pick<RiskSubtypeCurationSuggestEligibleRisk, 'name' | 'synonymous'>;
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
  const { family, enrichment, risk, warnings: initialWarnings } = params;

  let {
    suggestedInclude,
    confidence,
    rationale,
    reasonCategory,
  } = params;

  const warnings = [...initialWarnings];
  let externalStructuralMatch = false;

  if (!enrichment) {
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

  if (family === RiskSubtypeCurationFamily.FEN_HA) {
    if (
      matchesIsocyanateCompound(risk) ||
      hints.isIsocyanateHint === true
    ) {
      return {
        suggestedInclude: false,
        confidence: 'high',
        rationale: FEN_HA_ISOCYANATE_EXCLUDE_RATIONALE,
        reasonCategory: 'NOT_A_MATCH',
        warnings,
        externalStructuralMatch: false,
      };
    }

    if (hints.isPhenolOrCresolHint === true && extConf !== 'low') {
      suggestedInclude = true;
      confidence = extConf === 'high' ? 'high' : boostConfidence(confidence);
      rationale = 'possui grupo fenólico compatível com FEN/HA';
      reasonCategory = 'STRUCTURAL_MATCH';
      externalStructuralMatch = true;
    } else if (
      (hints.hasAromaticRing === true || hints.hasBenzeneRingHint === true) &&
      !hints.isPhenolOrCresolHint &&
      extConf !== 'low'
    ) {
      if (suggestedInclude) {
        warnings.push(
          'Decisão ajustada: aromaticidade PubChem sem indício fenólico não basta para FEN/HA.',
        );
      }
      suggestedInclude = false;
      confidence = 'high';
      rationale =
        'Fontes públicas indicam aromaticidade, mas sem grupo fenólico para FEN/HA.';
      reasonCategory = 'NOT_A_MATCH';
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

  if (family === RiskSubtypeCurationFamily.ISO) {
    if (hints.isIsocyanateHint === true && extConf !== 'low') {
      suggestedInclude = true;
      confidence = extConf === 'high' ? 'high' : 'medium';
      rationale = 'Fontes públicas indicam grupo isocianato.';
      reasonCategory = 'STRUCTURAL_MATCH';
      externalStructuralMatch = true;
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

  if (family === RiskSubtypeCurationFamily.HC_HA_HAP) {
    if (hints.isPolycyclicAromaticHint === true && extConf !== 'low') {
      suggestedInclude = true;
      confidence = extConf === 'high' ? 'high' : 'medium';
      rationale = 'Fontes públicas indicam hidrocarboneto aromático policíclico (HAP).';
      reasonCategory = 'STRUCTURAL_MATCH';
      externalStructuralMatch = true;
    } else if (hints.hasBenzeneRingHint === true && !hints.isPolycyclicAromaticHint) {
      suggestedInclude = false;
      confidence = 'high';
      rationale = 'Fontes públicas indicam aromático monocíclico; não é HAP.';
      reasonCategory = 'NOT_A_MATCH';
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

  if (family === RiskSubtypeCurationFamily.HC_HA) {
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
      (hints.isPhenolOrCresolHint ||
        hints.isNitroAromaticHint ||
        hints.isAromaticAmineHint ||
        hints.isPolycyclicAromaticHint) &&
      extConf !== 'low'
    ) {
      suggestedInclude = false;
      confidence = 'medium';
      rationale =
        'Fontes públicas indicam subtipo estrutural mais específico que HC/HA.';
      reasonCategory = 'AMBIGUOUS';
      if (!warnings.includes(MORE_SPECIFIC_SUBTYPE_WARNING)) {
        warnings.push(MORE_SPECIFIC_SUBTYPE_WARNING);
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

    if (
      (hints.hasAromaticRing === true || hints.hasBenzeneRingHint === true) &&
      extConf !== 'low' &&
      !hints.isAliphaticHint
    ) {
      if (!suggestedInclude || confidence === 'low') {
        suggestedInclude = true;
        confidence = extConf === 'high' ? boostConfidence(confidence) : 'medium';
        rationale =
          'Fontes técnicas públicas (PubChem) indicam estrutura aromática compatível com HC/HA.';
        reasonCategory = 'STRUCTURAL_MATCH';
        externalStructuralMatch = true;
      } else if (confidence === 'medium' && extConf === 'high') {
        confidence = 'high';
        externalStructuralMatch = true;
      }
    }
  }

  if (family === RiskSubtypeCurationFamily.NITRO_HA && hints.isNitroAromaticHint) {
    if (hints.isPhenolOrCresolHint || matchesNitrophenolCompound(risk)) {
      suggestedInclude = false;
      confidence = 'medium';
      rationale = 'Nitrofenólico; subtipo NITRO/FEN/HA é mais específico.';
      reasonCategory = 'AMBIGUOUS';
    } else if (extConf !== 'low') {
      suggestedInclude = true;
      confidence = 'high';
      rationale = 'Fontes públicas indicam nitrocomposto aromático.';
      reasonCategory = 'STRUCTURAL_MATCH';
      externalStructuralMatch = true;
    }
  }

  if (
    family === RiskSubtypeCurationFamily.NITRO_FEN_HA &&
    (hints.isPhenolOrCresolHint || hints.isNitroAromaticHint) &&
    (matchesNitrophenolCompound(risk) || matchesPhenolicCompound(risk)) &&
    extConf !== 'low'
  ) {
    suggestedInclude = true;
    confidence = 'high';
    rationale = 'Fontes públicas indicam derivado nitrofenólico.';
    reasonCategory = 'STRUCTURAL_MATCH';
    externalStructuralMatch = true;
  }

  if (
    family === RiskSubtypeCurationFamily.AMAR_HA &&
    hints.isAromaticAmineHint &&
    extConf !== 'low'
  ) {
    suggestedInclude = true;
    confidence = 'high';
    rationale = 'Fontes públicas indicam amina aromática.';
    reasonCategory = 'STRUCTURAL_MATCH';
    externalStructuralMatch = true;
  }

  if (
    family === RiskSubtypeCurationFamily.HC_HALI &&
    hints.isAliphaticHint &&
    extConf !== 'low'
  ) {
    suggestedInclude = true;
    confidence = 'high';
    rationale = 'Fontes públicas indicam hidrocarboneto alifático.';
    reasonCategory = 'STRUCTURAL_MATCH';
    externalStructuralMatch = true;
  }

  if (
    matchesIsocyanateCompound(risk) &&
    family === RiskSubtypeCurationFamily.HC_HA &&
    suggestedInclude
  ) {
    suggestedInclude = false;
    reasonCategory = 'AMBIGUOUS';
  }

  if (
    matchesPolycyclicAromatic(risk) &&
    family === RiskSubtypeCurationFamily.HC_HA &&
    suggestedInclude
  ) {
    suggestedInclude = false;
    confidence = 'medium';
    rationale = 'Policíclico aromático; subtipo HAP é mais específico que HC/HA.';
    reasonCategory = 'AMBIGUOUS';
    warnings.push(MORE_SPECIFIC_SUBTYPE_WARNING);
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
