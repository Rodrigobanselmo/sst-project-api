import type { RiskSubtypeCurationSuggestEligibleRisk } from './risk-subtype-curation-suggest.types';

export function normalizeSearchText(parts: string[]): string {
  return parts
    .join(' ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

export function getRiskSearchText(
  risk: Pick<RiskSubtypeCurationSuggestEligibleRisk, 'name' | 'synonymous'>,
): string {
  return normalizeSearchText([risk.name, ...risk.synonymous]);
}

export function matchesAnyPattern(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

const PHENOLIC_PATTERNS = [
  /\bfenol\b|\bphenol\b/i,
  /\bcresol\b|\bcresói/i,
  /xilenol|xylenol/i,
  /catecol|catechol/i,
  /resorcinol|resorcin/i,
  /hidroquinona|hydroquinone/i,
  /clorofenol|chlorophenol/i,
  /nitrofenol|nitrophenol/i,
  /dinitrofenol|dinitrophenol/i,
  /aminofenol|aminophenol/i,
  /pirógalo|pyrogallol/i,
  /\bfenóis\b/i,
  /metoxifenol|methoxyphenol/i,
];

const NITROPHENOL_PATTERNS = [
  /nitrofenol|nitrophenol/i,
  /dinitrofenol|dinitrophenol/i,
  /trinitrofenol|trinitrophenol/i,
];

const SIMPLE_MONOCYCLIC_AROMATIC_PATTERNS = [
  /\bbenzeno\b|\bbenzene\b/i,
  /\btoluen[oi]?\b|\btoluene\b/i,
  /\bxilen|xylene/i,
  /dimetil[\s-]?benzen|dimethylbenzene/i,
  /etilbenzen|ethylbenzene/i,
  /\bestiren|\bstyren/i,
];

const POLYCYCLIC_AROMATIC_PATTERNS = [
  /naftalen|naphthalen/i,
  /metil[\s-]?naftalen|methyl[\s-]?naphthalen/i,
  /antracen|anthracen/i,
  /fenantr|phenanthr/i,
  /\bpireno\b|\bpyrene\b/i,
  /benzo\s*\[?\s*a\s*\]?\s*pireno|benzo\[a\]pyrene/i,
  /benzo\s*\[?\s*a\s*\]?\s*antraceno|benzo\[a\]anthracene/i,
  /acenaft|acenaphth/i,
  /bifenil|biphenyl/i,
];

const AROMATIC_AMINE_PATTERNS = [
  /\banilin|\baniline\b/i,
  /toluidin/i,
  /xilidin/i,
  /benzidin/i,
  /\baminofenol|\baminophenol/i,
];

const NITRO_AROMATIC_NON_PHENOL_PATTERNS = [
  /nitrobenzen|nitrobenzene/i,
  /trinitrotoluen|trinitrotoluene|\bTNT\b/i,
  /dinitrotoluen|dinitrotoluene/i,
  /nitrotoluen|nitrotoluene/i,
  /nitroclorobenzen|nitrochlorobenzene/i,
];

const ISOCYANATE_PATTERNS = [
  /isocianat|isocyanat/i,
  /diisocianat|diisocyanat/i,
  /\bTDI\b/i,
  /\bMDI\b/i,
  /\bHDI\b/i,
  /tolylene diisocyanate|toluene diisocyanate/i,
  /poli[\s-]?isocianat|polyisocyanat/i,
];

export const FEN_HA_ISOCYANATE_EXCLUDE_RATIONALE =
  'isocianato sem grupo fenólico; deve ser avaliado no subtipo ISO.';

const ALIPHATIC_HYDROCARBON_PATTERNS = [
  /butadien/i,
  /\bciclohexan|\bcyclohexan/i,
  /\bciclohexen|\bcyclohexen/i,
  /\balcen/i,
  /\bdien/i,
  /\balifatic/i,
  /olefin/i,
  /parafin/i,
  /\balcan/i,
  /\balquen/i,
  /\balquin/i,
  /\bhexano\b|\bheptano\b|\bpropano\b|\bbutano\b/i,
  /hexen/i,
];

const HALOGENATED_AROMATIC_PATTERNS = [
  /triclorobenzen|trichlorobenzene/i,
  /clorobenzen|chlorobenzene/i,
  /bromobenzen|bromobenzene/i,
  /fluorobenzen|fluorobenzene/i,
  /halobenzen/i,
];

const NON_AROMATIC_FUNCTIONAL_PATTERNS = [
  /acetalde/i,
  /formalde/i,
  /\baldeido\b|\baldeid\b/i,
  /\bcetona\b|\bketone\b/i,
  /\bester\b|\bestero\b/i,
  /\balcool\b|\balcohol\b/i,
  /carboxil/i,
  /nitril/i,
];

const HERBICIDE_PATTERNS = [
  /\b2[\s,]*4[\s-]*D\b/i,
  /\b2[\s,]*4[\s,]*5[\s-]*T\b/i,
  /clorofenoxi|chlorophenoxy/i,
  /herbicid/i,
];

const PERSISTENT_ORGCL_PATTERNS = [
  /\bPCB\b/i,
  /bifenilos?\s+policlor|polychlorinated biphenyl/i,
  /\bPCDD\b|\bPCDF\b/i,
];

const SOLVENT_PATTERNS = [/\bsolvente\b/i, /\bsolvent\b/i];

export function matchesPhenolicCompound(
  risk: Pick<RiskSubtypeCurationSuggestEligibleRisk, 'name' | 'synonymous'>,
): boolean {
  return matchesAnyPattern(getRiskSearchText(risk), PHENOLIC_PATTERNS);
}

export function matchesNitrophenolCompound(
  risk: Pick<RiskSubtypeCurationSuggestEligibleRisk, 'name' | 'synonymous'>,
): boolean {
  return matchesAnyPattern(getRiskSearchText(risk), NITROPHENOL_PATTERNS);
}

export function matchesSimpleMonocyclicAromatic(
  risk: Pick<RiskSubtypeCurationSuggestEligibleRisk, 'name' | 'synonymous'>,
): boolean {
  const text = getRiskSearchText(risk);
  if (matchesIsocyanateCompound(risk)) return false;
  if (matchesPhenolicCompound(risk)) return false;
  if (matchesNitrophenolCompound(risk)) return false;
  return matchesAnyPattern(text, SIMPLE_MONOCYCLIC_AROMATIC_PATTERNS);
}

export function matchesPolycyclicAromatic(
  risk: Pick<RiskSubtypeCurationSuggestEligibleRisk, 'name' | 'synonymous'>,
): boolean {
  const text = getRiskSearchText(risk);
  if (matchesPhenolicCompound(risk) || matchesNitrophenolCompound(risk)) {
    return false;
  }
  return matchesAnyPattern(text, POLYCYCLIC_AROMATIC_PATTERNS);
}

export function matchesAromaticNameSignal(
  risk: Pick<RiskSubtypeCurationSuggestEligibleRisk, 'name' | 'synonymous'>,
): boolean {
  return (
    matchesSimpleMonocyclicAromatic(risk) || matchesPolycyclicAromatic(risk)
  );
}

export function matchesAromaticAmineCompound(
  risk: Pick<RiskSubtypeCurationSuggestEligibleRisk, 'name' | 'synonymous'>,
): boolean {
  return matchesAnyPattern(getRiskSearchText(risk), AROMATIC_AMINE_PATTERNS);
}

export function matchesNitroAromaticNonPhenol(
  risk: Pick<RiskSubtypeCurationSuggestEligibleRisk, 'name' | 'synonymous'>,
): boolean {
  const text = getRiskSearchText(risk);
  if (matchesPhenolicCompound(risk) || matchesNitrophenolCompound(risk)) {
    return false;
  }
  return matchesAnyPattern(text, NITRO_AROMATIC_NON_PHENOL_PATTERNS);
}

export function matchesIsocyanateCompound(
  risk: Pick<RiskSubtypeCurationSuggestEligibleRisk, 'name' | 'synonymous'>,
): boolean {
  return matchesAnyPattern(getRiskSearchText(risk), ISOCYANATE_PATTERNS);
}

export function matchesAliphaticHydrocarbonSignal(
  risk: Pick<RiskSubtypeCurationSuggestEligibleRisk, 'name' | 'synonymous'>,
): boolean {
  const text = getRiskSearchText(risk);
  if (matchesSimpleMonocyclicAromatic(risk) || matchesPolycyclicAromatic(risk)) {
    return false;
  }
  return matchesAnyPattern(text, ALIPHATIC_HYDROCARBON_PATTERNS);
}

export function matchesHalogenatedAromaticNonPhenol(
  risk: Pick<RiskSubtypeCurationSuggestEligibleRisk, 'name' | 'synonymous'>,
): boolean {
  const text = getRiskSearchText(risk);
  if (matchesPhenolicCompound(risk)) return false;
  return matchesAnyPattern(text, HALOGENATED_AROMATIC_PATTERNS);
}

export function matchesNonAromaticFunctionalClass(
  risk: Pick<RiskSubtypeCurationSuggestEligibleRisk, 'name' | 'synonymous'>,
): boolean {
  const text = getRiskSearchText(risk);
  const hasFunctional = matchesAnyPattern(text, NON_AROMATIC_FUNCTIONAL_PATTERNS);
  if (!hasFunctional) return false;
  return !matchesAromaticNameSignal(risk);
}

export function matchesHerbicideCompound(
  risk: Pick<RiskSubtypeCurationSuggestEligibleRisk, 'name' | 'synonymous'>,
): boolean {
  return matchesAnyPattern(getRiskSearchText(risk), HERBICIDE_PATTERNS);
}

export function matchesPersistentOrganochlorine(
  risk: Pick<RiskSubtypeCurationSuggestEligibleRisk, 'name' | 'synonymous'>,
): boolean {
  return matchesAnyPattern(getRiskSearchText(risk), PERSISTENT_ORGCL_PATTERNS);
}

export function matchesSolventSignal(
  risk: Pick<RiskSubtypeCurationSuggestEligibleRisk, 'name' | 'synonymous'>,
): boolean {
  return matchesAnyPattern(getRiskSearchText(risk), SOLVENT_PATTERNS);
}

export function matchesFenHaExcludeSignal(
  risk: Pick<RiskSubtypeCurationSuggestEligibleRisk, 'name' | 'synonymous'>,
): boolean {
  if (matchesIsocyanateCompound(risk)) {
    return true;
  }
  if (matchesPhenolicCompound(risk) || matchesNitrophenolCompound(risk)) {
    return false;
  }
  return (
    matchesNonAromaticFunctionalClass(risk) ||
    matchesSimpleMonocyclicAromatic(risk) ||
    matchesPolycyclicAromatic(risk) ||
    matchesAromaticAmineCompound(risk) ||
    matchesNitroAromaticNonPhenol(risk) ||
    matchesHalogenatedAromaticNonPhenol(risk) ||
    matchesAliphaticHydrocarbonSignal(risk)
  );
}

export function resolveFenHaExcludeRationale(
  risk: Pick<RiskSubtypeCurationSuggestEligibleRisk, 'name' | 'synonymous'>,
): string {
  if (matchesIsocyanateCompound(risk)) {
    return FEN_HA_ISOCYANATE_EXCLUDE_RATIONALE;
  }

  const text = getRiskSearchText(risk);

  if (matchesNonAromaticFunctionalClass(risk)) {
    if (/acetalde|formalde/i.test(text) || /\baldeido\b|\baldeid\b/i.test(text)) {
      return 'aldeído alifático sem anel aromático e sem hidroxila fenólica';
    }
    if (/\bcetona\b|\bketone\b/i.test(text)) {
      return 'cetona sem grupo fenólico; incompatível com FEN/HA';
    }
    return 'aldeído alifático sem anel aromático e sem hidroxila fenólica';
  }

  if (matchesAliphaticHydrocarbonSignal(risk)) {
    return 'hidrocarboneto alifático/insaturado sem grupo fenólico';
  }

  if (
    matchesSimpleMonocyclicAromatic(risk) ||
    matchesPolycyclicAromatic(risk) ||
    matchesHalogenatedAromaticNonPhenol(risk) ||
    matchesAromaticAmineCompound(risk) ||
    matchesNitroAromaticNonPhenol(risk)
  ) {
    return 'aromático sem hidroxila fenólica';
  }

  return 'Composto sem grupo fenólico compatível com FEN/HA';
}
