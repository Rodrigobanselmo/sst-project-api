import { HoMethodImportAiReviewCatalogItem } from './ho-method-import-ai-review.types';

const SOLVENT_EQUIVALENTS: Record<string, string[]> = {
  ch2cl2: ['diclorometano', 'dichloromethane', 'methylene chloride'],
  cs2: ['dissulfeto de carbono', 'carbon disulfide'],
  methanol: ['metanol', 'metil alcohol', 'methyl alcohol'],
  water: ['agua', 'água', 'h2o'],
  acetonitrile: ['acetonitrila'],
  acetone: ['acetona'],
  hexane: ['n-hexano', 'n hexano'],
  toluene: ['tolueno'],
};

const normalizeCatalogText = (value?: string | null) =>
  value
    ?.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim() ?? '';

const tokenize = (value: string) =>
  normalizeCatalogText(value)
    .split(/\s+/)
    .filter((token) => token.length > 1);

const expandTerms = (value?: string | null) => {
  const normalized = normalizeCatalogText(value);
  if (!normalized) return [] as string[];

  const terms = new Set<string>([normalized]);
  Object.entries(SOLVENT_EQUIVALENTS).forEach(([key, aliases]) => {
    if (normalized.includes(key) || aliases.some((alias) => normalized.includes(normalizeCatalogText(alias)))) {
      terms.add(key);
      aliases.forEach((alias) => terms.add(normalizeCatalogText(alias)));
    }
  });

  return Array.from(terms);
};

const scoreCatalogMatch = (
  candidate: string,
  catalog: HoMethodImportAiReviewCatalogItem,
) => {
  const candidateTerms = expandTerms(candidate);
  if (!candidateTerms.length) return 0;

  const catalogTerms = new Set<string>([
    ...expandTerms(catalog.name),
    ...(catalog.synonyms ?? []).flatMap((synonym) => expandTerms(synonym)),
  ]);

  let score = 0;
  candidateTerms.forEach((term) => {
    if (catalogTerms.has(term)) score += 4;
    catalogTerms.forEach((catalogTerm) => {
      if (catalogTerm.includes(term) || term.includes(catalogTerm)) score += 2;
    });
  });

  return score;
};

export const matchHoMethodImportCatalogItem = (
  candidate: string | null | undefined,
  catalog: HoMethodImportAiReviewCatalogItem[],
): HoMethodImportAiReviewCatalogItem | null => {
  if (!candidate?.trim() || !catalog.length) return null;

  const ranked = catalog
    .map((item) => ({ item, score: scoreCatalogMatch(candidate, item) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];
  if (!best || best.score < 4) return null;

  if (ranked[1] && ranked[1].score === best.score) return null;

  return best.item;
};

export const normalizeHoMethodCatalogSynonyms = (
  synonyms?: string[] | null,
): string[] | undefined => {
  if (!synonyms?.length) return undefined;
  return synonyms.map((item) => item.trim()).filter(Boolean);
};

export { normalizeCatalogText, expandTerms, tokenize };
