import type { ChemicalIdentityEnrichmentResult } from './chemical-identity-enrichment/chemical-identity-enrichment.types';
import { applyExternalEnrichmentHints } from './risk-subtype-curation-suggest-enrichment.normalization';
import type {
  RiskSubtypeCurationSuggestCandidate,
  RiskSubtypeCurationSuggestChunkAiItem,
  RiskSubtypeCurationSuggestConfidence,
  RiskSubtypeCurationSuggestEligibleRisk,
  RiskSubtypeCurationSuggestReasonCategory,
} from './risk-subtype-curation-suggest.types';

const OMISSION_WARNING =
  'Sem evidência suficiente na resposta da IA para classificar este risco.';

const ISOCYANATE_OVERLAP_WARNING =
  'Possui relação aromática, mas o grupo isocianato é tecnicamente mais específico; avaliar subtipo Isocianatos ou subtipo combinado.';

const AROMATIC_HYDROCARBON_SUBTYPE_PATTERN =
  /hidrocarboneto.*arom[aá]tico|aromatic hydrocarbon/i;

const AROMATIC_NAME_PATTERNS = [
  /\bbenzen/i,
  /\bbenzol\b/i,
  /\btoluen[oi]?\b/i,
  /\bxilen/i,
  /dimetil[\s-]?benzen/i,
  /dimethylbenzene/i,
  /etilbenzen/i,
  /ethylbenzene/i,
  /naftalen|naphthalen/i,
  /metil[\s-]?naftalen|methyl[\s-]?naphthalen/i,
  /acenaft|acenaphth/i,
  /antracen|anthracen/i,
  /fenantr|phenanthr/i,
  /\bestiren|\bstyren/i,
  /bifenil|biphenyl/i,
];

const ALIPHATIC_HYDROCARBON_PATTERNS = [
  /butadien/i,
  /\balcen/i,
  /\bdien/i,
  /\balifatic/i,
  /olefin/i,
  /parafin/i,
  /\balcan/i,
  /\balquen/i,
  /\balquin/i,
  /\betilen/i,
  /\bpropilen/i,
  /\bisopren/i,
  /\bpoliolef/i,
];

const ISOCYANATE_PATTERNS = [/isocianat/i, /diisocianat/i];

const NON_AROMATIC_FUNCTIONAL_PATTERNS = [
  /acetalde/i,
  /formalde/i,
  /\baldeido\b|\baldeid\b/i,
  /\bcetona\b|\bketone\b/i,
  /\bester\b|\bestero\b/i,
  /\balcool\b|\balcohol\b/i,
  /carboxil/i,
  /nitril/i,
  /\bamin\b/i,
];

const TOXICITY_ONLY_RATIONALE =
  /carcinog|sistema nervoso|\bsnc\b|irrita[cç][aã]o|toxicidade|f[ií]gado|rim\b|órg[aã]o.alvo|potencial tóxico/i;

const STRUCTURAL_RATIONALE =
  /arom[aá]tic|anel|benzen|naftal|xilen|toluen|estrutura|núcleo|policíclic|hidrocarboneto/i;

const CONTRADICTORY_INCLUDE_RATIONALE =
  /n[aã]o\s+(?:é|e|apresenta|possui|tem|se\s+enquadra|pertence|classifica)|sem\s+caracter[ií]sticas?\s+arom|n[aã]o\s+arom[aá]tic|n[aã]o\s+se\s+enquadra|n[aã]o\s+pertence|n[aã]o\s+[eé]\s+hidrocarboneto\s+arom|aus[eê]ncia\s+de\s+anel\s+arom/i;

export function isAromaticHydrocarbonSubType(subTypeName: string): boolean {
  return AROMATIC_HYDROCARBON_SUBTYPE_PATTERN.test(subTypeName);
}

function normalizeSearchText(parts: string[]): string {
  return parts
    .join(' ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function getRiskSearchText(risk: RiskSubtypeCurationSuggestEligibleRisk): string {
  return normalizeSearchText([risk.name, ...risk.synonymous]);
}

export function matchesIsocyanateCompound(
  risk: RiskSubtypeCurationSuggestEligibleRisk,
): boolean {
  const text = getRiskSearchText(risk);
  return ISOCYANATE_PATTERNS.some((pattern) => pattern.test(text));
}

export function matchesAliphaticHydrocarbonSignal(
  risk: RiskSubtypeCurationSuggestEligibleRisk,
): boolean {
  const text = getRiskSearchText(risk);
  return ALIPHATIC_HYDROCARBON_PATTERNS.some((pattern) => pattern.test(text));
}

export function matchesAromaticNameSignal(
  risk: RiskSubtypeCurationSuggestEligibleRisk,
): boolean {
  if (matchesIsocyanateCompound(risk) || matchesAliphaticHydrocarbonSignal(risk)) {
    return false;
  }
  const text = getRiskSearchText(risk);
  return AROMATIC_NAME_PATTERNS.some((pattern) => pattern.test(text));
}

export function matchesNonAromaticFunctionalClass(
  risk: RiskSubtypeCurationSuggestEligibleRisk,
): boolean {
  const text = getRiskSearchText(risk);
  const hasFunctional = NON_AROMATIC_FUNCTIONAL_PATTERNS.some((pattern) =>
    pattern.test(text),
  );
  if (!hasFunctional) return false;
  return !matchesAromaticNameSignal(risk);
}

export function isContradictoryIncludeRationale(rationale: string): boolean {
  const value = rationale.trim();
  if (!value) return false;
  return CONTRADICTORY_INCLUDE_RATIONALE.test(value);
}

function isToxicityOnlyRationale(rationale: string): boolean {
  const value = rationale.trim();
  if (!value) return false;
  if (STRUCTURAL_RATIONALE.test(value)) return false;
  return TOXICITY_ONLY_RATIONALE.test(value);
}

function boostConfidence(
  current: RiskSubtypeCurationSuggestConfidence,
): RiskSubtypeCurationSuggestConfidence {
  if (current === 'low') return 'high';
  if (current === 'medium') return 'high';
  return current;
}

function applyFinalGuards(params: {
  suggestedInclude: boolean;
  confidence: RiskSubtypeCurationSuggestConfidence;
  rationale: string;
  reasonCategory?: RiskSubtypeCurationSuggestReasonCategory;
  aromaticSubtype: boolean;
  externalStructuralMatch?: boolean;
}): {
  suggestedInclude: boolean;
  confidence: RiskSubtypeCurationSuggestConfidence;
  rationale: string;
  reasonCategory?: RiskSubtypeCurationSuggestReasonCategory;
} {
  let { suggestedInclude, confidence, rationale, reasonCategory } = params;

  if (
    reasonCategory === 'NAME_SYNONYM_MATCH' ||
    (reasonCategory === 'STRUCTURAL_MATCH' && params.externalStructuralMatch)
  ) {
    return { suggestedInclude, confidence, rationale, reasonCategory };
  }

  if (
    suggestedInclude &&
    (isContradictoryIncludeRationale(rationale) ||
      (!STRUCTURAL_RATIONALE.test(rationale) && isToxicityOnlyRationale(rationale)))
  ) {
    suggestedInclude = false;
    confidence = confidence === 'low' ? 'medium' : confidence;
    rationale =
      'A justificativa indica que o composto não se enquadra como hidrocarboneto aromático.';
    reasonCategory = 'NOT_A_MATCH';
  }

  return { suggestedInclude, confidence, rationale, reasonCategory };
}

export function normalizeSuggestCandidate(params: {
  subTypeName: string;
  risk: RiskSubtypeCurationSuggestEligibleRisk;
  ai?: RiskSubtypeCurationSuggestChunkAiItem;
  enrichment?: ChemicalIdentityEnrichmentResult;
}): RiskSubtypeCurationSuggestCandidate {
  const { subTypeName, risk, ai, enrichment } = params;
  const hasSubtype = risk.subTypes.length > 0;
  const aromaticSubtype = isAromaticHydrocarbonSubType(subTypeName);
  const isocyanate = matchesIsocyanateCompound(risk);
  const aliphatic = matchesAliphaticHydrocarbonSignal(risk);
  const aromaticName = matchesAromaticNameSignal(risk);
  const nonAromaticFunctional = matchesNonAromaticFunctionalClass(risk);

  let suggestedInclude = ai?.suggestedInclude ?? false;
  let confidence: RiskSubtypeCurationSuggestConfidence = ai?.confidence ?? 'low';
  let rationale =
    ai?.rationale?.trim() ||
    'Informação insuficiente para enquadramento estrutural automático.';
  let reasonCategory: RiskSubtypeCurationSuggestReasonCategory | undefined;
  const warnings = [...(ai?.warnings ?? [])].filter(
    (warning) => !isGenericWarning(warning),
  );

  if (aromaticSubtype && isocyanate) {
    suggestedInclude = false;
    confidence = 'medium';
    rationale =
      'Composto isocianato com núcleo derivado de tolueno; não é hidrocarboneto aromático genérico.';
    reasonCategory = 'AMBIGUOUS';
    if (!warnings.includes(ISOCYANATE_OVERLAP_WARNING)) {
      warnings.push(ISOCYANATE_OVERLAP_WARNING);
    }
  } else if (aromaticSubtype && aliphatic) {
    suggestedInclude = false;
    confidence = 'high';
    rationale =
      'Hidrocarbonato alifático/dieno/olefínico sem anel aromático; não é hidrocarboneto aromático.';
    reasonCategory = 'NOT_A_MATCH';
  } else if (aromaticSubtype && nonAromaticFunctional) {
    suggestedInclude = false;
    confidence = 'high';
    rationale =
      'Composto com grupo funcional não aromático (ex.: aldeído); não é hidrocarboneto aromático.';
    reasonCategory = 'NOT_A_MATCH';
  } else if (!ai) {
    reasonCategory = 'INSUFFICIENT_DATA';
    if (aromaticSubtype && aromaticName) {
      suggestedInclude = true;
      confidence = 'high';
      rationale =
        'Nome ou sinônimo indica núcleo aromático compatível com hidrocarbonetos aromáticos.';
      reasonCategory = 'NAME_SYNONYM_MATCH';
    } else {
      suggestedInclude = false;
      confidence = 'low';
      rationale = 'Sem evidência estrutural suficiente para enquadramento automático.';
      warnings.push(OMISSION_WARNING);
    }
  } else if (aromaticSubtype && aromaticName) {
    if (!suggestedInclude || confidence === 'low') {
      suggestedInclude = true;
      confidence = boostConfidence(confidence);
      rationale =
        'Nome ou sinônimo indica estrutura aromática (anel benzênico ou policíclico compatível).';
      reasonCategory = 'NAME_SYNONYM_MATCH';
    } else if (confidence === 'medium') {
      confidence = 'high';
      reasonCategory = 'NAME_SYNONYM_MATCH';
      if (!STRUCTURAL_RATIONALE.test(rationale) || isToxicityOnlyRationale(rationale)) {
        rationale =
          'Padrão nominal de hidrocarboneto aromático (ex.: benzeno, xileno, naftaleno ou derivado).';
      }
    } else if (
      isContradictoryIncludeRationale(rationale) ||
      isToxicityOnlyRationale(rationale)
    ) {
      suggestedInclude = true;
      confidence = 'high';
      rationale =
        'Nome ou sinônimo indica estrutura aromática compatível com hidrocarbonetos aromáticos.';
      reasonCategory = 'NAME_SYNONYM_MATCH';
    } else {
      reasonCategory = suggestedInclude ? 'STRUCTURAL_MATCH' : 'NOT_A_MATCH';
    }
  } else if (aromaticSubtype && suggestedInclude && isToxicityOnlyRationale(rationale)) {
    suggestedInclude = false;
    confidence = 'medium';
    rationale =
      'Justificativa baseada em toxicidade/órgão-alvo, não em critério estrutural do subtipo.';
    reasonCategory = 'NOT_A_MATCH';
  } else {
    reasonCategory = suggestedInclude
      ? confidence === 'low'
        ? 'AMBIGUOUS'
        : 'STRUCTURAL_MATCH'
      : confidence === 'low'
        ? 'INSUFFICIENT_DATA'
        : 'NOT_A_MATCH';
  }

  const enriched = applyExternalEnrichmentHints({
    aromaticSubtype,
    suggestedInclude,
    confidence,
    rationale,
    reasonCategory,
    warnings,
    enrichment,
  });
  suggestedInclude = enriched.suggestedInclude;
  confidence = enriched.confidence;
  rationale = enriched.rationale;
  reasonCategory = enriched.reasonCategory;
  warnings.length = 0;
  warnings.push(...enriched.warnings);

  const guarded = applyFinalGuards({
    suggestedInclude,
    confidence,
    rationale,
    reasonCategory,
    aromaticSubtype,
    externalStructuralMatch: enriched.externalStructuralMatch,
  });
  suggestedInclude = guarded.suggestedInclude;
  confidence = guarded.confidence;
  rationale = guarded.rationale;
  reasonCategory = guarded.reasonCategory;

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

export function isGenericWarning(warning: string): boolean {
  const normalized = warning.trim().toLowerCase();
  return (
    normalized.includes('não classificado pela ia nesta execução') ||
    normalized === OMISSION_WARNING.toLowerCase()
  );
}
