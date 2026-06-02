import { RiskCatalogKind } from '@prisma/client';

import {
  addRecMedCatalogMatchKeysToSet,
  normalizeInventoryItemName,
} from '@/shared/utils/normalize-inventory-item-name.util';

import type { RiskCatalogEquivalenceRow } from './risk-catalog-equivalence.types';

export function resolveCanonicalIdFromMap(
  itemId: string,
  aliasToCanonical: ReadonlyMap<string, string>,
): string {
  let current = itemId;
  const visited = new Set<string>();

  while (aliasToCanonical.has(current)) {
    if (visited.has(current)) break;
    visited.add(current);
    current = aliasToCanonical.get(current) as string;
  }

  return current;
}

export function getCanonicalOrSelfFromMap(
  itemId: string,
  aliasToCanonical: ReadonlyMap<string, string>,
): string {
  return resolveCanonicalIdFromMap(itemId, aliasToCanonical);
}

export function buildAliasToCanonicalMapFromRows(
  rows: Array<{ aliasId: string; canonicalId: string }>,
): Map<string, string> {
  const map = new Map<string, string>();
  for (const row of rows) {
    map.set(row.aliasId, row.canonicalId);
  }
  return map;
}

/** Remove itens que são alias ativos (dropdowns de inventário/caracterização). */
export function excludeActiveAliasCatalogRows<T extends { id: string }>(
  rows: T[],
  aliasToCanonical: ReadonlyMap<string, string>,
): T[] {
  if (!aliasToCanonical.size) return rows;
  return rows.filter((row) => !aliasToCanonical.has(row.id));
}

export type RiskCatalogNameSetsLike = {
  generateSources: Set<string>;
  recommendationRecNames: Set<string>;
  measureMedNames: Set<string>;
};

/** Enriquece sets de catálogo com labels registradas em equivalências ativas. */
export function enrichCatalogNameSetsWithEquivalences(
  catalog: RiskCatalogNameSetsLike,
  equivalences: RiskCatalogEquivalenceRow[],
): void {
  for (const row of equivalences) {
    if (row.kind === RiskCatalogKind.GENERATE_SOURCE) {
      const normalized = normalizeInventoryItemName(row.canonicalLabel);
      if (normalized) catalog.generateSources.add(normalized);
      const aliasNormalized = normalizeInventoryItemName(row.aliasLabel);
      if (aliasNormalized) catalog.generateSources.add(aliasNormalized);
      continue;
    }

    addRecMedCatalogMatchKeysToSet(
      catalog.recommendationRecNames,
      row.canonicalLabel,
    );
    addRecMedCatalogMatchKeysToSet(catalog.recommendationRecNames, row.aliasLabel);
    addRecMedCatalogMatchKeysToSet(catalog.measureMedNames, row.canonicalLabel);
    addRecMedCatalogMatchKeysToSet(catalog.measureMedNames, row.aliasLabel);
  }
}
