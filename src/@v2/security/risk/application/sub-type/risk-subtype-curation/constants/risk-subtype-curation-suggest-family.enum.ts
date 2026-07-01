export enum RiskSubtypeCurationFamily {
  NITRO_FEN_HA = 'NITRO/FEN/HA',
  ORGCL_HA_HH_PERSIST = 'ORGCL/HA/HH/PERSIST',
  HC_HA_HAP = 'HC/HA/HAP',
  HERB_HA_HH = 'HERB/HA/HH',
  NITRO_HA = 'NITRO/HA',
  FEN_HA = 'FEN/HA',
  AMAR_HA = 'AMAR/HA',
  HC_HALI = 'HC/HALI',
  HC_HH = 'HC/HH',
  ORGCL_HH = 'ORGCL/HH',
  HC_HA = 'HC/HA',
  ISO = 'ISO',
  SOLV = 'SOLV',
  GENERIC = 'GENERIC',
}

/** Tags mais específicas primeiro. */
export const RISK_SUBTYPE_CURATION_FAMILY_TAGS: RiskSubtypeCurationFamily[] = [
  RiskSubtypeCurationFamily.NITRO_FEN_HA,
  RiskSubtypeCurationFamily.ORGCL_HA_HH_PERSIST,
  RiskSubtypeCurationFamily.HC_HA_HAP,
  RiskSubtypeCurationFamily.HERB_HA_HH,
  RiskSubtypeCurationFamily.NITRO_HA,
  RiskSubtypeCurationFamily.FEN_HA,
  RiskSubtypeCurationFamily.AMAR_HA,
  RiskSubtypeCurationFamily.HC_HALI,
  RiskSubtypeCurationFamily.HC_HH,
  RiskSubtypeCurationFamily.ORGCL_HH,
  RiskSubtypeCurationFamily.HC_HA,
  RiskSubtypeCurationFamily.ISO,
  RiskSubtypeCurationFamily.SOLV,
];
