import { getMatrizRisk } from '@/@v2/shared/domain/functions/security/get-matrix-risk.func';

const MATRIX_RISK_LABELS: Record<number, string> = {
  0: 'Não informado',
  1: 'Muito baixo',
  2: 'Baixo',
  3: 'Moderado',
  4: 'Alto',
  5: 'Muito alto',
  6: 'Interromper',
};

export const getOccupationalRiskLabel = (severity?: number, probability?: number): string => {
  const level = getMatrizRisk(severity, probability);
  return MATRIX_RISK_LABELS[level] ?? 'Não informado';
};

const PROBABILITY_LABELS: Record<number, string> = {
  0: 'não contabilizar',
  1: 'Desprezível',
  2: 'Pequena',
  3: 'Moderada',
  4: 'Significativa',
  5: 'Excessiva',
};

export const getProbabilityLabel = (probability?: number): string => {
  if (probability == null) return 'Não informado';
  return PROBABILITY_LABELS[Math.round(probability)] ?? String(probability);
};

const SEVERITY_LABELS: Record<number, string> = {
  1: 'Desprezível',
  2: 'Pequena',
  3: 'Moderada',
  4: 'Significante',
  5: 'Excessiva',
};

export const getSeverityLabel = (severity?: number): string => {
  if (severity == null) return 'Não informado';
  return SEVERITY_LABELS[severity] ?? String(severity);
};
