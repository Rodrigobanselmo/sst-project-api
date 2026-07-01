import { RiskSubtypeCurationFamily } from './constants/risk-subtype-curation-suggest-family.enum';
import type {
  RiskSubtypeCurationSuggestChunkAiItem,
  RiskSubtypeCurationSuggestConfidence,
  RiskSubtypeCurationSuggestEligibleRisk,
  RiskSubtypeCurationSuggestReasonCategory,
} from './risk-subtype-curation-suggest.types';
import {
  matchesAliphaticHydrocarbonSignal,
  matchesAromaticAmineCompound,
  matchesAromaticNameSignal,
  matchesFenHaExcludeSignal,
  matchesHalogenatedAromaticNonPhenol,
  matchesHerbicideCompound,
  matchesIsocyanateCompound,
  matchesNitroAromaticNonPhenol,
  matchesNitrophenolCompound,
  matchesNonAromaticFunctionalClass,
  matchesPersistentOrganochlorine,
  matchesPhenolicCompound,
  matchesPolycyclicAromatic,
  matchesSimpleMonocyclicAromatic,
  resolveFenHaExcludeRationale,
} from './risk-subtype-curation-suggest-risk-signals';

const OMISSION_WARNING =
  'Sem evidência suficiente na resposta da IA para classificar este risco.';

const ISOCYANATE_OVERLAP_WARNING =
  'Possui relação aromática, mas o grupo isocianato é tecnicamente mais específico; avaliar subtipo Isocianatos ou subtipo combinado.';

const MORE_SPECIFIC_SUBTYPE_WARNING =
  'O composto parece pertencer a subtipo químico mais específico que o alvo atual.';

const TOXICITY_ONLY_RATIONALE =
  /carcinog|sistema nervoso|\bsnc\b|irrita[cç][aã]o|toxicidade|f[ií]gado|rim\b|órg[aã]o.alvo|potencial tóxico/i;

const STRUCTURAL_RATIONALE =
  /arom[aá]tic|anel|benzen|naftal|xilen|toluen|estrutura|núcleo|policíclic|hidrocarboneto|fenol|fenólic|hidroxil|cresol|isocianat|nitro|amina|halogen|alif[aá]tic/i;

const GENERIC_AROMATIC_ONLY_RATIONALE =
  /anel arom[aá]tic|n[uú]cleo benz[eê]nic|composto arom[aá]tic|estrutura arom[aá]tic/i;

export const CONTRADICTORY_INCLUDE_RATIONALE =
  /n[aã]o\s+(?:é|e|apresenta|possui|tem|se\s+enquadra|pertence|classifica)|sem\s+caracter[ií]sticas?\s+arom|n[aã]o\s+arom[aá]tic|n[aã]o\s+se\s+enquadra|n[aã]o\s+pertence|n[aã]o\s+[eé]\s+hidrocarboneto\s+arom|aus[eê]ncia\s+de\s+anel\s+arom/i;

export type FamilyStructuralDecision = {
  suggestedInclude: boolean;
  confidence: RiskSubtypeCurationSuggestConfidence;
  rationale: string;
  reasonCategory?: RiskSubtypeCurationSuggestReasonCategory;
  warnings: string[];
  structuralNameMatch?: boolean;
};

function boostConfidence(
  current: RiskSubtypeCurationSuggestConfidence,
): RiskSubtypeCurationSuggestConfidence {
  if (current === 'low') return 'high';
  if (current === 'medium') return 'high';
  return current;
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

function isGenericAromaticOnlyRationale(rationale: string): boolean {
  const value = rationale.trim();
  if (!value) return false;
  if (/fenol|fenólic|hidroxil|cresol|isocianat|nitrofen|aminofen/i.test(value)) {
    return false;
  }
  return GENERIC_AROMATIC_ONLY_RATIONALE.test(value);
}

function baseFromAi(ai?: RiskSubtypeCurationSuggestChunkAiItem): FamilyStructuralDecision {
  return {
    suggestedInclude: ai?.suggestedInclude ?? false,
    confidence: ai?.confidence ?? 'low',
    rationale:
      ai?.rationale?.trim() ||
      'Informação insuficiente para enquadramento estrutural automático.',
    warnings: [...(ai?.warnings ?? [])].filter((warning) => !isGenericWarning(warning)),
  };
}

function includeMatch(
  rationale: string,
  confidence: RiskSubtypeCurationSuggestConfidence = 'high',
  reasonCategory: RiskSubtypeCurationSuggestReasonCategory = 'NAME_SYNONYM_MATCH',
  structuralNameMatch = true,
): FamilyStructuralDecision {
  return {
    suggestedInclude: true,
    confidence,
    rationale,
    reasonCategory,
    warnings: [],
    structuralNameMatch,
  };
}

function excludeMatch(
  rationale: string,
  confidence: RiskSubtypeCurationSuggestConfidence = 'high',
  reasonCategory: RiskSubtypeCurationSuggestReasonCategory = 'NOT_A_MATCH',
): FamilyStructuralDecision {
  return {
    suggestedInclude: false,
    confidence,
    rationale,
    reasonCategory,
    warnings: [],
  };
}

function applyHcHaRules(
  risk: RiskSubtypeCurationSuggestEligibleRisk,
  ai?: RiskSubtypeCurationSuggestChunkAiItem,
): FamilyStructuralDecision {
  const decision = baseFromAi(ai);

  if (matchesIsocyanateCompound(risk)) {
    return {
      suggestedInclude: false,
      confidence: 'medium',
      rationale:
        'Composto isocianato; não é hidrocarboneto aromático genérico (subtipo ISO é mais específico).',
      reasonCategory: 'AMBIGUOUS',
      warnings: [ISOCYANATE_OVERLAP_WARNING],
    };
  }

  if (matchesAliphaticHydrocarbonSignal(risk)) {
    return excludeMatch(
      'Hidrocarbonato alifático/dieno/olefínico sem anel aromático; não é hidrocarboneto aromático.',
    );
  }

  if (matchesNonAromaticFunctionalClass(risk)) {
    return excludeMatch(
      'Composto com grupo funcional não aromático (ex.: aldeído); não é hidrocarboneto aromático.',
    );
  }

  if (
    matchesPhenolicCompound(risk) ||
    matchesNitrophenolCompound(risk) ||
    matchesAromaticAmineCompound(risk) ||
    matchesNitroAromaticNonPhenol(risk) ||
    matchesPolycyclicAromatic(risk)
  ) {
    return {
      suggestedInclude: false,
      confidence: 'medium',
      rationale:
        'Composto com subtipo estrutural mais específico que HC/HA (fenólico, nitro, amina aromática ou HAP).',
      reasonCategory: 'AMBIGUOUS',
      warnings: [MORE_SPECIFIC_SUBTYPE_WARNING],
    };
  }

  if (!ai) {
    if (matchesSimpleMonocyclicAromatic(risk)) {
      return includeMatch(
        'Nome ou sinônimo indica hidrocarboneto aromático monocíclico compatível com HC/HA.',
      );
    }
    return {
      suggestedInclude: false,
      confidence: 'low',
      rationale: 'Sem evidência estrutural suficiente para enquadramento automático.',
      reasonCategory: 'INSUFFICIENT_DATA',
      warnings: [OMISSION_WARNING],
    };
  }

  if (matchesSimpleMonocyclicAromatic(risk)) {
    if (!decision.suggestedInclude || decision.confidence === 'low') {
      return includeMatch(
        'Nome ou sinônimo indica estrutura aromática monocíclica compatível com HC/HA.',
        boostConfidence(decision.confidence),
      );
    }
    if (decision.confidence === 'medium') {
      return includeMatch(
        'Padrão nominal de hidrocarboneto aromático monocíclico compatível com HC/HA.',
        'high',
      );
    }
    if (
      isContradictoryIncludeRationale(decision.rationale) ||
      isToxicityOnlyRationale(decision.rationale)
    ) {
      return includeMatch(
        'Nome ou sinônimo indica hidrocarboneto aromático monocíclico compatível com HC/HA.',
      );
    }
    return {
      ...decision,
      reasonCategory: decision.suggestedInclude ? 'STRUCTURAL_MATCH' : 'NOT_A_MATCH',
      structuralNameMatch: decision.suggestedInclude,
    };
  }

  if (decision.suggestedInclude && isToxicityOnlyRationale(decision.rationale)) {
    return excludeMatch(
      'Justificativa baseada em toxicidade/órgão-alvo, não em critério estrutural do subtipo.',
      'medium',
    );
  }

  return {
    ...decision,
    reasonCategory: decision.suggestedInclude
      ? decision.confidence === 'low'
        ? 'AMBIGUOUS'
        : 'STRUCTURAL_MATCH'
      : decision.confidence === 'low'
        ? 'INSUFFICIENT_DATA'
        : 'NOT_A_MATCH',
  };
}

function applyFenHaRules(
  risk: RiskSubtypeCurationSuggestEligibleRisk,
  ai?: RiskSubtypeCurationSuggestChunkAiItem,
): FamilyStructuralDecision {
  if (matchesIsocyanateCompound(risk)) {
    return excludeMatch(resolveFenHaExcludeRationale(risk));
  }

  if (matchesPhenolicCompound(risk)) {
    return includeMatch('possui grupo fenólico compatível com FEN/HA');
  }

  if (matchesFenHaExcludeSignal(risk)) {
    return excludeMatch(resolveFenHaExcludeRationale(risk));
  }

  const decision = baseFromAi(ai);
  if (!ai) {
    return {
      suggestedInclude: false,
      confidence: 'low',
      rationale: 'Sem evidência de grupo fenólico para enquadramento em FEN/HA.',
      reasonCategory: 'INSUFFICIENT_DATA',
      warnings: [OMISSION_WARNING],
    };
  }

  if (
    decision.suggestedInclude &&
    (isGenericAromaticOnlyRationale(decision.rationale) ||
      isToxicityOnlyRationale(decision.rationale) ||
      isContradictoryIncludeRationale(decision.rationale))
  ) {
    return excludeMatch(
      'Aromaticidade isolada não basta para FEN/HA; é necessário grupo fenólico.',
      'medium',
    );
  }

  return {
    ...decision,
    reasonCategory: decision.suggestedInclude ? 'AMBIGUOUS' : 'NOT_A_MATCH',
  };
}

function applyIsoRules(
  risk: RiskSubtypeCurationSuggestEligibleRisk,
  ai?: RiskSubtypeCurationSuggestChunkAiItem,
): FamilyStructuralDecision {
  if (matchesIsocyanateCompound(risk)) {
    return includeMatch('Nome ou sinônimo indica grupo isocianato (N=C=O).');
  }

  const decision = baseFromAi(ai);
  if (!ai) {
    return {
      suggestedInclude: false,
      confidence: 'low',
      rationale: 'Sem evidência de grupo isocianato.',
      reasonCategory: 'INSUFFICIENT_DATA',
      warnings: [OMISSION_WARNING],
    };
  }

  if (decision.suggestedInclude && !matchesIsocyanateCompound(risk)) {
    return excludeMatch(
      'Composto sem grupo isocianato identificável; não pertence a ISO.',
      'medium',
    );
  }

  return {
    ...decision,
    reasonCategory: decision.suggestedInclude ? 'STRUCTURAL_MATCH' : 'NOT_A_MATCH',
  };
}

function applyAmarHaRules(
  risk: RiskSubtypeCurationSuggestEligibleRisk,
  ai?: RiskSubtypeCurationSuggestChunkAiItem,
): FamilyStructuralDecision {
  if (matchesAromaticAmineCompound(risk)) {
    return includeMatch('Nome ou sinônimo indica amina aromática.');
  }

  if (matchesPhenolicCompound(risk) && !/aminofenol|aminophenol/i.test(risk.name)) {
    return excludeMatch('Fenólico sem grupo amina dominante; não é AMAR/HA.');
  }

  if (matchesSimpleMonocyclicAromatic(risk) || matchesPolycyclicAromatic(risk)) {
    return excludeMatch('Hidrocarboneto aromático sem grupo amina; não é AMAR/HA.');
  }

  const decision = baseFromAi(ai);
  return {
    ...decision,
    reasonCategory: 'INSUFFICIENT_DATA',
    warnings: ai ? decision.warnings : [OMISSION_WARNING],
  };
}

function applyNitroFenHaRules(
  risk: RiskSubtypeCurationSuggestEligibleRisk,
  ai?: RiskSubtypeCurationSuggestChunkAiItem,
): FamilyStructuralDecision {
  if (matchesNitrophenolCompound(risk) || /nitrofenol|nitrophenol/i.test(risk.name)) {
    return includeMatch('Derivado nitrofenólico com grupo fenólico.');
  }

  if (matchesNitroAromaticNonPhenol(risk)) {
    return excludeMatch('Nitroaromático sem grupo fenólico; preferir NITRO/HA.');
  }

  const decision = baseFromAi(ai);
  return {
    ...decision,
    reasonCategory: decision.suggestedInclude ? 'STRUCTURAL_MATCH' : 'NOT_A_MATCH',
    warnings: ai ? decision.warnings : [OMISSION_WARNING],
  };
}

function applyNitroHaRules(
  risk: RiskSubtypeCurationSuggestEligibleRisk,
  ai?: RiskSubtypeCurationSuggestChunkAiItem,
): FamilyStructuralDecision {
  if (matchesNitrophenolCompound(risk)) {
    return {
      suggestedInclude: false,
      confidence: 'medium',
      rationale: 'Nitrofenólico; subtipo NITRO/FEN/HA é mais específico.',
      reasonCategory: 'AMBIGUOUS',
      warnings: [MORE_SPECIFIC_SUBTYPE_WARNING],
    };
  }

  if (matchesNitroAromaticNonPhenol(risk)) {
    return includeMatch('Nitrocomposto aromático sem grupo fenólico dominante.');
  }

  const decision = baseFromAi(ai);
  return {
    ...decision,
    reasonCategory: decision.suggestedInclude ? 'STRUCTURAL_MATCH' : 'NOT_A_MATCH',
    warnings: ai ? decision.warnings : [OMISSION_WARNING],
  };
}

function applyHapRules(
  risk: RiskSubtypeCurationSuggestEligibleRisk,
  ai?: RiskSubtypeCurationSuggestChunkAiItem,
): FamilyStructuralDecision {
  if (matchesPolycyclicAromatic(risk)) {
    return includeMatch('Composto policíclico aromático compatível com HAP.');
  }

  if (matchesSimpleMonocyclicAromatic(risk)) {
    return excludeMatch(
      'Aromático monocíclico simples; não é HAP (policíclico aromático).',
    );
  }

  const decision = baseFromAi(ai);
  return {
    ...decision,
    reasonCategory: decision.suggestedInclude ? 'STRUCTURAL_MATCH' : 'NOT_A_MATCH',
    warnings: ai ? decision.warnings : [OMISSION_WARNING],
  };
}

function applyHcHaliRules(
  risk: RiskSubtypeCurationSuggestEligibleRisk,
  ai?: RiskSubtypeCurationSuggestChunkAiItem,
): FamilyStructuralDecision {
  if (matchesAliphaticHydrocarbonSignal(risk)) {
    return includeMatch('Hidrocarboneto alifático sem aromaticidade.');
  }

  if (matchesAromaticNameSignal(risk)) {
    return excludeMatch('Composto aromático; não é hidrocarboneto alifático.');
  }

  const decision = baseFromAi(ai);
  return {
    ...decision,
    reasonCategory: decision.suggestedInclude ? 'STRUCTURAL_MATCH' : 'NOT_A_MATCH',
    warnings: ai ? decision.warnings : [OMISSION_WARNING],
  };
}

function applyHcHhRules(
  risk: RiskSubtypeCurationSuggestEligibleRisk,
  ai?: RiskSubtypeCurationSuggestChunkAiItem,
): FamilyStructuralDecision {
  if (matchesHalogenatedAromaticNonPhenol(risk) || /cloro|bromo|fluoro|iodo/i.test(risk.name)) {
    return includeMatch('Hidrocarboneto halogenado identificado no nome.');
  }

  const decision = baseFromAi(ai);
  return {
    ...decision,
    reasonCategory: decision.suggestedInclude ? 'STRUCTURAL_MATCH' : 'NOT_A_MATCH',
    warnings: ai ? decision.warnings : [OMISSION_WARNING],
  };
}

function applyHerbRules(
  risk: RiskSubtypeCurationSuggestEligibleRisk,
  ai?: RiskSubtypeCurationSuggestChunkAiItem,
): FamilyStructuralDecision {
  if (matchesHerbicideCompound(risk)) {
    return includeMatch('Herbicida ou derivado clorofenoxiacético identificado.');
  }

  const decision = baseFromAi(ai);
  return {
    ...decision,
    reasonCategory: decision.suggestedInclude ? 'STRUCTURAL_MATCH' : 'NOT_A_MATCH',
    warnings: ai ? decision.warnings : [OMISSION_WARNING],
  };
}

function applyPersistRules(
  risk: RiskSubtypeCurationSuggestEligibleRisk,
  ai?: RiskSubtypeCurationSuggestChunkAiItem,
): FamilyStructuralDecision {
  if (matchesPersistentOrganochlorine(risk)) {
    return includeMatch('Organoclorado aromático persistente ou PCB identificado.');
  }

  const decision = baseFromAi(ai);
  return {
    ...decision,
    reasonCategory: decision.suggestedInclude ? 'STRUCTURAL_MATCH' : 'NOT_A_MATCH',
    warnings: ai ? decision.warnings : [OMISSION_WARNING],
  };
}

export function applyFamilyStructuralRules(params: {
  family: RiskSubtypeCurationFamily;
  risk: RiskSubtypeCurationSuggestEligibleRisk;
  ai?: RiskSubtypeCurationSuggestChunkAiItem;
}): FamilyStructuralDecision {
  const { family, risk, ai } = params;

  switch (family) {
    case RiskSubtypeCurationFamily.FEN_HA:
      return applyFenHaRules(risk, ai);
    case RiskSubtypeCurationFamily.ISO:
      return applyIsoRules(risk, ai);
    case RiskSubtypeCurationFamily.AMAR_HA:
      return applyAmarHaRules(risk, ai);
    case RiskSubtypeCurationFamily.NITRO_FEN_HA:
      return applyNitroFenHaRules(risk, ai);
    case RiskSubtypeCurationFamily.NITRO_HA:
      return applyNitroHaRules(risk, ai);
    case RiskSubtypeCurationFamily.HC_HA_HAP:
      return applyHapRules(risk, ai);
    case RiskSubtypeCurationFamily.HC_HALI:
      return applyHcHaliRules(risk, ai);
    case RiskSubtypeCurationFamily.HC_HH:
    case RiskSubtypeCurationFamily.ORGCL_HH:
      return applyHcHhRules(risk, ai);
    case RiskSubtypeCurationFamily.HERB_HA_HH:
      return applyHerbRules(risk, ai);
    case RiskSubtypeCurationFamily.ORGCL_HA_HH_PERSIST:
      return applyPersistRules(risk, ai);
    case RiskSubtypeCurationFamily.HC_HA:
      return applyHcHaRules(risk, ai);
    case RiskSubtypeCurationFamily.SOLV:
    case RiskSubtypeCurationFamily.GENERIC:
    default: {
      const decision = baseFromAi(ai);
      return {
        ...decision,
        reasonCategory: decision.suggestedInclude
          ? decision.confidence === 'low'
            ? 'AMBIGUOUS'
            : 'STRUCTURAL_MATCH'
          : 'INSUFFICIENT_DATA',
        warnings: ai ? decision.warnings : [OMISSION_WARNING],
      };
    }
  }
}

export function applyFinalGuards(params: {
  family: RiskSubtypeCurationFamily;
  suggestedInclude: boolean;
  confidence: RiskSubtypeCurationSuggestConfidence;
  rationale: string;
  reasonCategory?: RiskSubtypeCurationSuggestReasonCategory;
  structuralNameMatch?: boolean;
  externalStructuralMatch?: boolean;
}): {
  suggestedInclude: boolean;
  confidence: RiskSubtypeCurationSuggestConfidence;
  rationale: string;
  reasonCategory?: RiskSubtypeCurationSuggestReasonCategory;
} {
  let { suggestedInclude, confidence, rationale, reasonCategory } = params;

  if (
    params.structuralNameMatch ||
    (reasonCategory === 'STRUCTURAL_MATCH' && params.externalStructuralMatch)
  ) {
    return { suggestedInclude, confidence, rationale, reasonCategory };
  }

  if (
    suggestedInclude &&
    (isContradictoryIncludeRationale(rationale) ||
      isToxicityOnlyRationale(rationale) ||
      (params.family === RiskSubtypeCurationFamily.FEN_HA &&
        isGenericAromaticOnlyRationale(rationale)))
  ) {
    suggestedInclude = false;
    confidence = confidence === 'low' ? 'medium' : confidence;
    rationale =
      params.family === RiskSubtypeCurationFamily.FEN_HA
        ? 'Aromaticidade isolada não basta para FEN/HA; é necessário grupo fenólico.'
        : 'A justificativa indica que o composto não se enquadra no subtipo alvo.';
    reasonCategory = 'NOT_A_MATCH';
  }

  return { suggestedInclude, confidence, rationale, reasonCategory };
}

export function isGenericWarning(warning: string): boolean {
  const normalized = warning.trim().toLowerCase();
  return (
    normalized.includes('não classificado pela ia nesta execução') ||
    normalized === OMISSION_WARNING.toLowerCase()
  );
}
