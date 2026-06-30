import { ESocialTable27Item } from '@/modules/esocial/repositories/implementations/ESocial27TableRepository';

import { normalizeText } from '../biological-indicator/biological-indicator-normalize.util';

export const ESOCIAL_T27_SEARCH_MIN_LENGTH = 3;
export const ESOCIAL_T27_SEARCH_DEFAULT_LIMIT = 15;

export const buildEsocialT27SourceIndicatorId = (
  riskFactorId: string,
  examId: number,
): string => `esocial-t27::${riskFactorId}::${examId}`;

export const isEsocialT27SourceIndicatorId = (
  sourceIndicatorId: string | null | undefined,
): boolean =>
  typeof sourceIndicatorId === 'string' &&
  sourceIndicatorId.startsWith('esocial-t27::');

export const searchEsocialT27Catalog = (
  catalog: ESocialTable27Item[],
  search: string,
  limit = ESOCIAL_T27_SEARCH_DEFAULT_LIMIT,
): ESocialTable27Item[] => {
  const normalizedSearch = normalizeText(search);
  if (normalizedSearch.length < ESOCIAL_T27_SEARCH_MIN_LENGTH) return [];

  const matches: Array<{ item: ESocialTable27Item; score: number }> = [];

  for (const item of catalog) {
    const normalizedName = normalizeText(item.name);
    if (!normalizedName) continue;

    if (normalizedName.includes(normalizedSearch)) {
      const startsWith = normalizedName.startsWith(normalizedSearch) ? 2 : 0;
      const position = normalizedName.indexOf(normalizedSearch);
      const positionScore = position === 0 ? 3 : position < 10 ? 1 : 0;
      matches.push({
        item,
        score: normalizedSearch.length + startsWith + positionScore,
      });
    }
  }

  return matches
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
    .slice(0, limit)
    .map((entry) => entry.item);
};
