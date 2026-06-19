import { IRiskLevelValues } from '@/@v2/shared/domain/types/security/risk-level-values.type';
import { getMatrizRisk } from '@/shared/utils/matriz';

const isValidMatrixInput = (n: unknown): n is number =>
  typeof n === 'number' && Number.isFinite(n) && n >= 1 && n <= 5;

const normalizeStoredLevel = (storedLevel?: number | null): IRiskLevelValues | null => {
  if (storedLevel == null || !Number.isFinite(storedLevel)) return null;
  const rounded = Math.round(storedLevel);
  if (rounded >= 1 && rounded <= 6) return rounded as IRiskLevelValues;
  return null;
};

/**
 * Resolve o nível de risco ocupacional para exibição/cálculo no Plano de Ação.
 * Prioriza o valor persistido; se inválido, calcula pela matriz (severity + probability).
 */
export function resolveOccupationalRiskLevel(
  severity?: number | null,
  probability?: number | null,
  storedLevel?: number | null,
): IRiskLevelValues | null {
  const fromStored = normalizeStoredLevel(storedLevel);
  if (fromStored != null) return fromStored;

  if (!isValidMatrixInput(severity) || !isValidMatrixInput(probability)) {
    return null;
  }

  const matriz = getMatrizRisk(severity, probability);
  if (!matriz?.level || matriz.level < 1 || matriz.level > 6) return null;

  return matriz.level as IRiskLevelValues;
}

export function isPersistableOccupationalRiskLevel(level: number): level is IRiskLevelValues {
  return Number.isFinite(level) && level >= 1 && level <= 6;
}
