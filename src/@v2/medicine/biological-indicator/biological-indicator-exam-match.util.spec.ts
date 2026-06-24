import { describe, expect, it } from '@jest/globals';
import {
  BiologicalIndicatorMatchConfidenceEnum,
  BiologicalIndicatorMatchMethodEnum,
  BiologicalIndicatorTableEnum,
  BiologicalIndicatorTypeEnum,
} from '@prisma/client';

import {
  BiologicalIndicatorExamSnapshot,
  BiologicalIndicatorMatchInput,
} from './biological-indicator-match.types';
import { matchIndicatorToExams } from './biological-indicator-exam-match.util';

const baseIndicator = (
  overrides: Partial<BiologicalIndicatorMatchInput> = {},
): BiologicalIndicatorMatchInput => ({
  id: 'indicator-1',
  substanceName: 'Benzeno',
  substanceNameNormalized: 'benzeno',
  casNumbers: ['71-43-2'],
  biologicalIndicatorNormalized: 'benzeno urinario',
  biologicalMatrix: 'urina',
  collectionMoment: 'FJ',
  tableNumber: BiologicalIndicatorTableEnum.QUADRO_1,
  indicatorType: BiologicalIndicatorTypeEnum.IBE_EE,
  isSubstanceGroup: false,
  requiresNormativeReview: false,
  ...overrides,
});

const exam = (
  overrides: Partial<BiologicalIndicatorExamSnapshot> = {},
): BiologicalIndicatorExamSnapshot => ({
  id: 1,
  name: 'Benzeno urinário',
  material: 'Urina',
  instruction: 'Coleta no final da jornada',
  analyses: 'Benzeno urinário',
  ...overrides,
});

describe('biological-indicator-exam-match.util', () => {
  it('faz match por nome/análises com alta confiança', () => {
    const matches = matchIndicatorToExams(baseIndicator(), [exam()]);

    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({
      examId: 1,
      matchConfidence: BiologicalIndicatorMatchConfidenceEnum.HIGH,
      matchMethod: BiologicalIndicatorMatchMethodEnum.NAME_EXACT,
    });
  });

  it('considera matriz biológica e momento de coleta', () => {
    const matches = matchIndicatorToExams(
      baseIndicator({
        biologicalIndicatorNormalized: 'colinesterase plasmatica',
        biologicalMatrix: 'sangue',
        collectionMoment: 'FJ',
      }),
      [
        exam({
          id: 2,
          name: 'Colinesterase plasmática',
          analyses: 'Colinesterase plasmática',
          material: 'Sangue',
          instruction: 'Final da jornada de trabalho',
        }),
      ],
    );

    expect(matches).toHaveLength(1);
    expect(matches[0].examId).toBe(2);
  });

  it('retorna vazio quando não há exame correspondente', () => {
    const matches = matchIndicatorToExams(baseIndicator(), [
      exam({
        id: 3,
        name: 'Hemograma completo',
        analyses: 'Hemograma',
        material: 'Sangue',
        instruction: null,
      }),
    ]);

    expect(matches).toHaveLength(0);
  });

  it('força requiresReview no Quadro 2', () => {
    const matches = matchIndicatorToExams(
      baseIndicator({
        tableNumber: BiologicalIndicatorTableEnum.QUADRO_2,
        indicatorType: BiologicalIndicatorTypeEnum.IBE_SC,
        requiresNormativeReview: true,
      }),
      [exam()],
    );

    expect(matches[0].requiresReview).toBe(true);
  });
});
