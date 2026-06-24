import { describe, expect, it } from '@jest/globals';
import {
  BiologicalIndicatorMatchConfidenceEnum,
  BiologicalIndicatorMatchMethodEnum,
  BiologicalIndicatorTableEnum,
  BiologicalIndicatorTypeEnum,
} from '@prisma/client';

import { BiologicalIndicatorMatchInput } from './biological-indicator-match.types';
import { matchIndicatorToRisks } from './biological-indicator-risk-match.util';

const baseIndicator = (
  overrides: Partial<BiologicalIndicatorMatchInput> = {},
): BiologicalIndicatorMatchInput => ({
  id: 'indicator-group-1',
  substanceName: 'Indutores de metahemoglobina',
  substanceNameNormalized: 'indutores de metahemoglobina',
  casNumbers: [],
  biologicalIndicatorNormalized: 'metahemoglobina',
  biologicalMatrix: 'sangue',
  collectionMoment: 'FJ',
  tableNumber: BiologicalIndicatorTableEnum.QUADRO_1,
  indicatorType: BiologicalIndicatorTypeEnum.IBE_EE,
  isSubstanceGroup: true,
  requiresNormativeReview: true,
  ...overrides,
});

describe('biological-indicator-risk-match.util — grupos normativos', () => {
  it('faz match exato por nome com o risco de catálogo do grupo', () => {
    const matches = matchIndicatorToRisks(
      baseIndicator(),
      [
        {
          id: 'risk-group-1',
          name: 'Indutores de metahemoglobina',
          cas: null,
          synonymous: ['Agentes indutores de metahemoglobina'],
        },
      ],
    );

    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({
      riskFactorId: 'risk-group-1',
      matchConfidence: BiologicalIndicatorMatchConfidenceEnum.HIGH,
      matchMethod: BiologicalIndicatorMatchMethodEnum.NAME_EXACT,
      requiresReview: true,
    });
  });
});
