import type {
  ChemicalIdentityNormalizedHints,
  ChemicalIdentitySourceResult,
} from './chemical-identity-enrichment.types';

const AROMATIC_TEXT =
  /aromatic hydrocarbon|benzene|benzeno|toluene|tolueno|xylene|xileno|dimethylbenzene|dimetilbenzen|ethylbenzene|etilbenzen|styrene|estireno|naphthalene|naftaleno|acenaphthene|acenafteno|acenaphthylene|acenaftileno|polycyclic aromatic|\bpa[hH]\b/i;

const BENZENE_RING_TEXT =
  /benzene|benzeno|toluene|tolueno|xylene|xileno|dimethylbenzene|dimetilbenzen|ethylbenzene|etilbenzen|styrene|estireno/i;

const POLYCYCLIC_AROMATIC_TEXT =
  /naphthalene|naftaleno|acenaphthene|acenafteno|acenaphthylene|acenaftileno|anthracene|antraceno|phenanthrene|fenantr|polycyclic aromatic/i;

const ALIPHATIC_TEXT =
  /butadiene|butadieno|\baliphatic\b|\balifatic|alkene|alceno|alkane|alcano|olefin|olefina|paraffin|parafina|dieno|\bdien\b/i;

const ISOCYANATE_TEXT = /isocyanate|isocianat|diisocyanate|diisocianat/i;

const NON_AROMATIC_FUNCTIONAL_TEXT =
  /aldehyde|aldeido|acetaldehyde|acetaldeido|ketone|cetona|ester|éster|carboxylic|carboxil|alcohol|álcool|nitrile|nitrila|\bamine\b|\bamina\b/i;

const HALOGENATED_TEXT = /chloro|cloro|bromo|fluoro|iodo|halogen/i;

const NITRO_AROMATIC_TEXT = /nitrobenzene|nitrobenzeno|nitrotoluene|trinitrotoluene|dinitrotoluene/i;

const AROMATIC_AMINE_TEXT = /aniline|anilina|aromatic amine|amina arom/i;

const PHENOL_TEXT =
  /phenol|fenol|cresol|cresói|xilenol|xylenol|catecol|catechol|resorcinol|hidroquinona|hydroquinone|clorofenol|chlorophenol|nitrofenol|nitrophenol|dinitrofenol|aminofenol|aminophenol|pirógalo|pyrogallol/i;

function buildCorpus(parts: (string | undefined)[]): string {
  return parts
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function hasPattern(text: string, pattern: RegExp): boolean {
  return pattern.test(text);
}

/** Conservador: SMILES aromático PubChem costuma usar 'c' minúsculo em anéis. */
export function inferAromaticRingFromSmiles(smiles?: string): boolean | null {
  if (!smiles?.trim()) return null;
  if (/\bc\d/i.test(smiles) || /c1cc/i.test(smiles)) return true;
  return null;
}

export function buildNormalizedHints(params: {
  title?: string;
  synonyms?: string[];
  description?: string;
  chemicalClasses?: string[];
  canonicalSmiles?: string;
}): ChemicalIdentityNormalizedHints {
  const corpus = buildCorpus([
    params.title,
    ...(params.synonyms ?? []).slice(0, 40),
    params.description,
    ...(params.chemicalClasses ?? []),
  ]);

  const classHints: string[] = [];
  if (hasPattern(corpus, AROMATIC_TEXT)) classHints.push('aromatic hydrocarbon');
  if (hasPattern(corpus, BENZENE_RING_TEXT)) classHints.push('benzene derivative');
  if (hasPattern(corpus, POLYCYCLIC_AROMATIC_TEXT)) {
    classHints.push('polycyclic aromatic');
  }
  if (hasPattern(corpus, ALIPHATIC_TEXT)) classHints.push('aliphatic hydrocarbon');
  if (hasPattern(corpus, ISOCYANATE_TEXT)) classHints.push('isocyanate');
  if (hasPattern(corpus, NON_AROMATIC_FUNCTIONAL_TEXT)) {
    classHints.push('non-aromatic functional group');
  }
  if (hasPattern(corpus, HALOGENATED_TEXT)) classHints.push('halogenated');

  const smilesAromatic = inferAromaticRingFromSmiles(params.canonicalSmiles);
  const isIsocyanateHint = hasPattern(corpus, ISOCYANATE_TEXT) ? true : null;

  return {
    hasAromaticRing:
      smilesAromatic === true ||
      (hasPattern(corpus, AROMATIC_TEXT) ? true : smilesAromatic),
    hasBenzeneRingHint: hasPattern(corpus, BENZENE_RING_TEXT) ? true : null,
    isPolycyclicAromaticHint: hasPattern(corpus, POLYCYCLIC_AROMATIC_TEXT)
      ? true
      : null,
    isAliphaticHint: hasPattern(corpus, ALIPHATIC_TEXT) ? true : null,
    isHalogenatedHint: hasPattern(corpus, HALOGENATED_TEXT) ? true : null,
    isIsocyanateHint,
    isNitroAromaticHint: hasPattern(corpus, NITRO_AROMATIC_TEXT) ? true : null,
    isAromaticAmineHint: hasPattern(corpus, AROMATIC_AMINE_TEXT) ? true : null,
    isPhenolOrCresolHint:
      isIsocyanateHint === true
        ? null
        : hasPattern(corpus, PHENOL_TEXT)
          ? true
          : null,
    matchedSynonyms: (params.synonyms ?? []).slice(0, 8),
    classHints: [...new Set(classHints)],
  };
}

export function mergeEnrichmentHints(
  sourceResults: ChemicalIdentitySourceResult[],
): ChemicalIdentityNormalizedHints {
  const pubchem = sourceResults.find(
    (result) => result.source === 'PUBCHEM' && result.found,
  );
  if (!pubchem) {
    return { classHints: [] };
  }

  return buildNormalizedHints({
    title: pubchem.title,
    synonyms: pubchem.synonyms,
    description: pubchem.description,
    chemicalClasses: pubchem.chemicalClasses,
    canonicalSmiles: pubchem.canonicalSmiles,
  });
}
