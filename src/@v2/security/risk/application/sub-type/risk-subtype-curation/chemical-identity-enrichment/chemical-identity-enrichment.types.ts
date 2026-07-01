export type ChemicalIdentitySource = 'PUBCHEM' | 'NIST' | 'NIOSH';

export type ChemicalIdentityMatchedBy = 'CAS' | 'NAME' | 'SYNONYM';

export type ChemicalIdentityConfidence = 'high' | 'medium' | 'low';

export type ChemicalIdentityEnrichmentInput = {
  riskFactorId: string;
  name: string;
  cas?: string | null;
  synonyms?: string[];
};

export type ChemicalIdentitySourceResult = {
  source: ChemicalIdentitySource;
  found: boolean;
  matchedBy?: ChemicalIdentityMatchedBy;
  cid?: string;
  title?: string;
  molecularFormula?: string;
  canonicalSmiles?: string;
  synonyms?: string[];
  description?: string;
  chemicalClasses?: string[];
  hazardOrOccupationalNotes?: string[];
  url?: string;
  confidence: ChemicalIdentityConfidence;
  warnings?: string[];
};

export type ChemicalIdentityNormalizedHints = {
  hasAromaticRing?: boolean | null;
  hasBenzeneRingHint?: boolean | null;
  isPolycyclicAromaticHint?: boolean | null;
  isAliphaticHint?: boolean | null;
  isHalogenatedHint?: boolean | null;
  isIsocyanateHint?: boolean | null;
  isNitroAromaticHint?: boolean | null;
  isAromaticAmineHint?: boolean | null;
  isPhenolOrCresolHint?: boolean | null;
  matchedSynonyms?: string[];
  classHints?: string[];
};

export type ChemicalIdentityEnrichmentResult = {
  sourceResults: ChemicalIdentitySourceResult[];
  normalizedHints: ChemicalIdentityNormalizedHints;
  warnings: string[];
};

export type RiskSubtypeCurationCandidateChemicalIdentity = {
  sources: string[];
  matchedBy?: ChemicalIdentityMatchedBy;
  title?: string;
  molecularFormula?: string;
  classHints?: string[];
  externalConfidence?: ChemicalIdentityConfidence;
  warnings?: string[];
};
