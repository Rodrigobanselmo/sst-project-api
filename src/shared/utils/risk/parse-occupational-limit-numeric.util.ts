import { normalizeOccupationalLimitValue } from './normalize-occupational-limit-value.util';

export function extractOccupationalLimitNumericToken(value?: string | null): string | null {
  const normalized = normalizeOccupationalLimitValue(value);
  if (!normalized) return null;

  const match = normalized.replace(',', '.').match(/-?\d+(\.\d+)?/);
  return match?.[0] ?? null;
}

export function parseOccupationalLimitNumeric(value?: string | null): number | null {
  const token = extractOccupationalLimitNumericToken(value);
  if (!token) return null;

  const parsed = Number(token);
  return Number.isFinite(parsed) ? parsed : null;
}
