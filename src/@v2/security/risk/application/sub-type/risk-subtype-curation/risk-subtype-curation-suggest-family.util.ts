import {
  RiskSubtypeCurationFamily,
  RISK_SUBTYPE_CURATION_FAMILY_TAGS,
} from './constants/risk-subtype-curation-suggest-family.enum';

export type RiskSubtypeCurationFamilyContext = {
  name: string;
  description?: string | null;
};

function extractTags(name: string): string[] {
  return [...name.matchAll(/\[([^\]]+)\]/g)].map((match) => match[1].trim());
}

function normalizeFamilyTag(tag: string): string {
  return tag.toUpperCase().replace(/\s+/g, '');
}

function matchTagToFamily(tag: string): RiskSubtypeCurationFamily | null {
  const normalized = normalizeFamilyTag(tag);
  for (const family of RISK_SUBTYPE_CURATION_FAMILY_TAGS) {
    if (normalizeFamilyTag(family) === normalized) {
      return family;
    }
  }
  return null;
}

function fallbackFamilyByText(text: string): RiskSubtypeCurationFamily {
  const value = text.toLowerCase();

  if (/nitrofen|nitro\s*f[eé]n|nitrofenol/i.test(value)) {
    return RiskSubtypeCurationFamily.NITRO_FEN_HA;
  }
  if (/bifenilos?\s+policlor|pcb|persistente/i.test(value)) {
    return RiskSubtypeCurationFamily.ORGCL_HA_HH_PERSIST;
  }
  if (/\bhap\b|polic[ií]clic.*arom|hidrocarbonetos?\s+arom[aá]tic.*polic/i.test(value)) {
    return RiskSubtypeCurationFamily.HC_HA_HAP;
  }
  if (/herbicid|clorofenoxi|2[\s,]*4/i.test(value)) {
    return RiskSubtypeCurationFamily.HERB_HA_HH;
  }
  if (/nitrocompost|nitroarom|nitrobenzen|trinitrotoluen/i.test(value)) {
    return RiskSubtypeCurationFamily.NITRO_HA;
  }
  if (/fen[oó]is?|cres[oó]is?/i.test(value)) {
    return RiskSubtypeCurationFamily.FEN_HA;
  }
  if (/aminas?\s+arom|anilina/i.test(value)) {
    return RiskSubtypeCurationFamily.AMAR_HA;
  }
  if (/alif[aá]tic|hc\/hali/i.test(value)) {
    return RiskSubtypeCurationFamily.HC_HALI;
  }
  if (/hidrocarbonet.*halogen|hc\/hh/i.test(value)) {
    return RiskSubtypeCurationFamily.HC_HH;
  }
  if (/organoclor|orgcl/i.test(value)) {
    return RiskSubtypeCurationFamily.ORGCL_HH;
  }
  if (/hidrocarbonet.*arom|hc\/ha/i.test(value)) {
    return RiskSubtypeCurationFamily.HC_HA;
  }
  if (/isocianat/i.test(value)) {
    return RiskSubtypeCurationFamily.ISO;
  }
  if (/solvente/i.test(value)) {
    return RiskSubtypeCurationFamily.SOLV;
  }

  return RiskSubtypeCurationFamily.GENERIC;
}

export function resolveRiskSubtypeCurationFamily(
  subType: RiskSubtypeCurationFamilyContext,
): RiskSubtypeCurationFamily {
  const tags = extractTags(subType.name);
  for (const tag of tags) {
    const family = matchTagToFamily(tag);
    if (family) return family;
  }

  const combined = [subType.name, subType.description ?? ''].join(' ');
  return fallbackFamilyByText(combined);
}

export function isAromaticHydrocarbonFamily(
  family: RiskSubtypeCurationFamily,
): boolean {
  return family === RiskSubtypeCurationFamily.HC_HA;
}

/** @deprecated Prefer resolveRiskSubtypeCurationFamily */
export function isAromaticHydrocarbonSubType(subTypeName: string): boolean {
  return (
    resolveRiskSubtypeCurationFamily({ name: subTypeName }) ===
    RiskSubtypeCurationFamily.HC_HA
  );
}
