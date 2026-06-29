/**
 * Canonical agent (chemical/biological substance) normalization helpers.
 *
 * Shared across NR-7 sync, ACGIH/BEI and the exam-risk-rule Library so that the
 * normalized value used at write time (e.g. `agentNameNormalized`) and the value
 * used at query time (agent filters) are produced by the exact same rule.
 */

/**
 * Normalizes an agent name: NFD, strips diacritics, trims and lower-cases.
 * Matches the value stored in `PcmsoExamRiskRule.agentNameNormalized`.
 * Returns null for empty/blank input.
 */
export const normalizeAgentName = (value?: string | null): string | null => {
  if (!value) return null;
  const normalized = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
  return normalized || null;
};

/**
 * Normalizes a CAS number to digits only (e.g. "108-88-3" -> "108883").
 * Returns null when there are no digits, so callers can safely skip the filter.
 */
export const normalizeCas = (value?: string | null): string | null => {
  if (!value) return null;
  const digits = value.replace(/\D/g, '');
  return digits || null;
};
