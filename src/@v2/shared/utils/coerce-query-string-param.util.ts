/**
 * Normaliza query param para string (evita number/boolean por implicit conversion).
 */
export function coerceQueryStringParam(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  const raw = Array.isArray(value) ? value[0] : value;
  const text = String(raw).trim();

  return text.length > 0 ? text : undefined;
}
