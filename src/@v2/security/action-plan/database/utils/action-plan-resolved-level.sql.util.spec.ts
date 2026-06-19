import { describe, expect, it } from '@jest/globals';

import { matrixRisk } from '@/modules/documents/constants/matrizRisk.constant';
import { getMatrizRisk } from '@/shared/utils/matriz';

/** Espelha a lógica SQL de action-plan-resolved-level.sql.util.ts */
function resolveLevelLikeSql(storedLevel: number | null, severity: number | null, probability: number | null): number | null {
  if (storedLevel != null && storedLevel >= 1 && storedLevel <= 6) return storedLevel;
  if (probability != null && probability >= 6 && severity != null && severity >= 1 && severity <= 6) return 6;
  if (
    severity != null &&
    severity >= 1 &&
    severity <= 5 &&
    probability != null &&
    probability >= 1 &&
    probability <= 5
  ) {
    return matrixRisk[5 - probability][severity - 1];
  }
  return null;
}

describe('action-plan resolved level SQL parity', () => {
  for (let severity = 1; severity <= 5; severity += 1) {
    for (let probability = 1; probability <= 5; probability += 1) {
      it(`matrix parity severity=${severity} probability=${probability}`, () => {
        const fromMatrix = getMatrizRisk(severity, probability).level;
        const fromSqlLogic = resolveLevelLikeSql(null, severity, probability);
        expect(fromSqlLogic).toBe(fromMatrix);
      });
    }
  }

  it('keeps persisted level over matrix', () => {
    expect(resolveLevelLikeSql(4, 1, 1)).toBe(4);
  });

  it('ignores stored zero and uses matrix', () => {
    expect(resolveLevelLikeSql(0, 4, 4)).toBe(getMatrizRisk(4, 4).level);
  });
});
