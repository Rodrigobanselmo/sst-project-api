import { describe, expect, it } from '@jest/globals';
import {
  BiologicalIndicatorTableEnum,
  BiologicalIndicatorTypeEnum,
} from '@prisma/client';

import {
  buildDefaultApplicability,
  QUADRO_1_APPLICABILITY_DEFAULT,
  QUADRO_2_APPLICABILITY_DEFAULT,
  resolveTableAndTypeFromSpreadsheet,
} from './biological-indicator-applicability.schema';

describe('biological-indicator-applicability.schema', () => {
  it('aplica default do Quadro 1', () => {
    const applicability = buildDefaultApplicability({
      tableNumber: BiologicalIndicatorTableEnum.QUADRO_1,
      indicatorType: BiologicalIndicatorTypeEnum.IBE_EE,
    });

    expect(applicability).toEqual(QUADRO_1_APPLICABILITY_DEFAULT);
  });

  it('aplica default conservador do Quadro 2', () => {
    const applicability = buildDefaultApplicability({
      tableNumber: BiologicalIndicatorTableEnum.QUADRO_2,
      indicatorType: BiologicalIndicatorTypeEnum.IBE_SC,
    });

    expect(applicability).toEqual(QUADRO_2_APPLICABILITY_DEFAULT);
  });

  it('resolve quadro e tipo a partir da planilha', () => {
    const quadro1 = resolveTableAndTypeFromSpreadsheet({
      quadro: 'Quadro 1',
      tipoIndicador: 'IBE/EE - Indicador Biológico de Exposição Excessiva',
    });

    expect(quadro1.tableNumber).toBe(BiologicalIndicatorTableEnum.QUADRO_1);
    expect(quadro1.indicatorType).toBe(BiologicalIndicatorTypeEnum.IBE_EE);

    const quadro2 = resolveTableAndTypeFromSpreadsheet({
      quadro: 'Quadro 2',
      tipoIndicador: 'IBE/SC - Indicador Biológico de Exposição com Significado Clínico',
    });

    expect(quadro2.tableNumber).toBe(BiologicalIndicatorTableEnum.QUADRO_2);
    expect(quadro2.indicatorType).toBe(BiologicalIndicatorTypeEnum.IBE_SC);
  });
});
