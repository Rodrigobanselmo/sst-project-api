/**
 * Gera slug estável para RiskSubType a partir do nome exibido.
 * Alinhado ao backfill da migration dynamic_risk_subtypes_catalog.
 */
export const buildRiskSubTypeSlug = (name: string): string => {
  const normalized = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

  const slug = normalized
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug;
};
