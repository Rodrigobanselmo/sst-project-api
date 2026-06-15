const OCCUPATIONAL_LIMIT_PLACEHOLDERS = new Set(['-', '--']);

/**
 * Normaliza texto de limite ocupacional para lógica de documentos/tabelas.
 * Traços (`-`, `--`) são marcadores de "conferido, sem limite" e equivalem a vazio.
 */
export function normalizeOccupationalLimitValue(
  value?: string | null,
): string | null {
  if (value == null) return null;

  const trimmed = value.trim();
  if (!trimmed || OCCUPATIONAL_LIMIT_PLACEHOLDERS.has(trimmed)) return null;

  return trimmed;
}

export function hasOccupationalLimitValue(value?: string | null): boolean {
  return normalizeOccupationalLimitValue(value) != null;
}
