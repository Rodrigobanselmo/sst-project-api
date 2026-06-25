import { rankRiskCatalogCandidate } from './risk-catalog-visibility.util';

const TRAILING_PUNCTUATION_PATTERN = /[.,;:]+$/;

export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function stripTrailingPunctuation(value: string): string {
  let result = value;
  while (TRAILING_PUNCTUATION_PATTERN.test(result)) {
    result = result.replace(TRAILING_PUNCTUATION_PATTERN, '').trimEnd();
  }
  return result;
}

/**
 * Normalização para equivalência de fontes geradoras / recomendações (catálogo e inventário).
 * Alinhado ao client FormQuestionsDashboard.
 */
export function normalizeInventoryItemName(name: string | undefined | null): string {
  if (!name) return '';

  const collapsed = name
    .replace(/\r\n/g, '\n')
    .replace(/[\n\r\t]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

  const lower = removeAccents(collapsed.toLowerCase());
  return stripTrailingPunctuation(lower);
}

export function areInventoryItemNamesEquivalent(
  a: string | undefined | null,
  b: string | undefined | null,
): boolean {
  const normalizedA = normalizeInventoryItemName(a);
  const normalizedB = normalizeInventoryItemName(b);
  return !!normalizedA && normalizedA === normalizedB;
}

export function inventoryNameSetHas(
  inventoryNames: Set<string>,
  itemName: string,
): boolean {
  const normalized = normalizeInventoryItemName(itemName);
  if (!normalized) return false;
  return inventoryNames.has(normalized);
}

/** Remove trechos entre parênteses — ex.: "(ética)" omitido ou reformulado pela IA. */
function stripParentheticalSegments(value: string): string {
  return value.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Variante cadastrada com cláusula intermediária que a IA costuma omitir.
 * Ex.: "... neutra (ética) e orientação baseada em princípios de justiça e escuta ativa."
 */
const OPTIONAL_JUSTICE_ORIENTACAO_CLAUSE =
  /\s+e\s+orientacao\s+baseada\s+em\s+principios\s+de\s+justica\s+e\s+/gi;

/**
 * Chaves de equivalência para catálogo RecMed (status/dedupe).
 * Mantém match exato; adiciona variantes seguras para divergências já vistas no banco.
 */
export function getRecMedCatalogMatchKeys(
  name: string | null | undefined,
): string[] {
  const base = normalizeInventoryItemName(name);
  if (!base) return [];

  const keys = new Set<string>([base]);

  const withoutParens = stripParentheticalSegments(base);
  if (withoutParens) keys.add(withoutParens);

  for (const source of [base, withoutParens]) {
    if (!source) continue;
    const withoutJusticeClause = source
      .replace(OPTIONAL_JUSTICE_ORIENTACAO_CLAUSE, ' e ')
      .replace(/\s+e\s+e\s+/g, ' e ')
      .replace(/\s+/g, ' ')
      .trim();
    if (withoutJusticeClause) keys.add(withoutJusticeClause);
  }

  return [...keys];
}

export function catalogNameSetHas(
  catalogNames: Set<string>,
  itemName: string,
): boolean {
  return getRecMedCatalogMatchKeys(itemName).some((key) =>
    catalogNames.has(key),
  );
}

export function addRecMedCatalogMatchKeysToSet(
  catalogNames: Set<string>,
  name: string | null | undefined,
): void {
  for (const key of getRecMedCatalogMatchKeys(name)) {
    catalogNames.add(key);
  }
}

export function getRecMedComparableNormalizedNames(recMed: {
  recName?: string | null;
  medName?: string | null;
}): string[] {
  const names = new Set<string>();
  const recName = normalizeInventoryItemName(recMed.recName);
  const medName = normalizeInventoryItemName(recMed.medName);
  if (recName) names.add(recName);
  if (medName) names.add(medName);
  return [...names];
}

export function recMedInputMatchesRecord(
  input: { recName?: string | null; medName?: string | null },
  record: { recName?: string | null; medName?: string | null },
): boolean {
  const inputKeys = [
    ...getRecMedCatalogMatchKeys(input.recName),
    ...getRecMedCatalogMatchKeys(input.medName),
  ];
  if (!inputKeys.length) return false;

  const recordKeys = [
    ...getRecMedCatalogMatchKeys(record.recName),
    ...getRecMedCatalogMatchKeys(record.medName),
  ];
  if (!recordKeys.length) return false;

  return inputKeys.some((key) => recordKeys.includes(key));
}

/**
 * Recomendações em `recAddOnly` só são válidas quando possuem texto em `recName`.
 * Remove itens nulos, vazios ou compostos apenas por espaços e aplica `trim()` nos
 * válidos, evitando a criação de `RecMed`/`RecMedOnRiskData` órfãos (cartões de
 * recomendação vazios). Não usa `medName` como fallback de recomendação.
 */
export function sanitizeRecAddOnlyItems<T extends { recName?: string | null }>(
  items: T[] | undefined | null,
): T[] {
  if (!items?.length) return [];

  return items.reduce<T[]>((acc, item) => {
    const recName = item?.recName?.trim();
    if (recName) acc.push({ ...item, recName });
    return acc;
  }, []);
}

export function findGenerateSourceByNormalizedName<
  T extends { id: string; name: string; companyId: string; system: boolean },
>(candidates: T[], name: string, scopeCompanyId: string): T | undefined {
  const target = normalizeInventoryItemName(name);
  if (!target) return undefined;

  const matches = candidates.filter(
    (candidate) => normalizeInventoryItemName(candidate.name) === target,
  );
  if (!matches.length) return undefined;

  return [...matches].sort((a, b) => {
    const rankDiff =
      rankRiskCatalogCandidate(a, scopeCompanyId) -
      rankRiskCatalogCandidate(b, scopeCompanyId);
    if (rankDiff !== 0) return rankDiff;
    return a.id.localeCompare(b.id);
  })[0];
}

export function findRecMedByNormalizedName<
  T extends {
    id: string;
    recName: string | null;
    medName: string | null;
    companyId: string;
    system: boolean;
  },
>(
  candidates: T[],
  input: { recName?: string | null; medName?: string | null },
  scopeCompanyId: string,
): T | undefined {
  const matches = candidates.filter((candidate) =>
    recMedInputMatchesRecord(input, candidate),
  );
  if (!matches.length) return undefined;

  return [...matches].sort((a, b) => {
    const rankDiff =
      rankRiskCatalogCandidate(a, scopeCompanyId) -
      rankRiskCatalogCandidate(b, scopeCompanyId);
    if (rankDiff !== 0) return rankDiff;
    return a.id.localeCompare(b.id);
  })[0];
}
