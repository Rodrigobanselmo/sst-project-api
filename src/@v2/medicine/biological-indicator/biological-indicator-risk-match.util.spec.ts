import { describe, expect, it } from '@jest/globals';
import {
  BiologicalIndicatorMatchConfidenceEnum,
  BiologicalIndicatorMatchMethodEnum,
  BiologicalIndicatorTableEnum,
  BiologicalIndicatorTypeEnum,
} from '@prisma/client';

import {
  BiologicalIndicatorMatchInput,
  BiologicalIndicatorRiskSnapshot,
} from './biological-indicator-match.types';
import {
  buildCatalogNameAliasMap,
  collectNormalizedCasNumbers,
  hasCasIntersection,
  matchIndicatorToRisks,
  scoreFuzzyNameMatch,
} from './biological-indicator-risk-match.util';

const baseIndicator = (
  overrides: Partial<BiologicalIndicatorMatchInput> = {},
): BiologicalIndicatorMatchInput => ({
  id: 'indicator-1',
  substanceName: 'Benzeno',
  substanceNameNormalized: 'benzeno',
  casNumbers: [],
  biologicalIndicatorNormalized: 'benzeno urinario',
  biologicalMatrix: 'Urina',
  collectionMoment: 'FJ',
  tableNumber: BiologicalIndicatorTableEnum.QUADRO_1,
  indicatorType: BiologicalIndicatorTypeEnum.IBE_EE,
  isSubstanceGroup: false,
  requiresNormativeReview: false,
  ...overrides,
});

const risk = (
  overrides: Partial<BiologicalIndicatorRiskSnapshot> = {},
): BiologicalIndicatorRiskSnapshot => ({
  id: 'risk-1',
  name: 'Benzeno',
  cas: '71-43-2',
  synonymous: [],
  ...overrides,
});

describe('biological-indicator-risk-match.util', () => {
  it('faz match CAS exato único com HIGH', () => {
    const matches = matchIndicatorToRisks(
      baseIndicator({ casNumbers: ['71-43-2'] }),
      [risk(), risk({ id: 'risk-2', name: 'Tolueno', cas: '108-88-3' })],
    );

    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({
      riskFactorId: 'risk-1',
      matchConfidence: BiologicalIndicatorMatchConfidenceEnum.HIGH,
      matchMethod: BiologicalIndicatorMatchMethodEnum.CAS_EXACT,
      requiresReview: false,
    });
  });

  it('marca múltiplos riscos por CAS como PROBABLE e revisão obrigatória', () => {
    const matches = matchIndicatorToRisks(
      baseIndicator({ casNumbers: ['71-43-2'], substanceNameNormalized: 'benzeno' }),
      [
        risk({ name: 'Benzeno comercial' }),
        risk({ id: 'risk-2', name: 'Benzeno técnico', cas: '71-43-2' }),
      ],
    );

    expect(matches).toHaveLength(2);
    expect(matches.every((item) => item.requiresReview)).toBe(true);
    expect(
      matches.every(
        (item) =>
          item.matchConfidence === BiologicalIndicatorMatchConfidenceEnum.PROBABLE,
      ),
    ).toBe(true);
  });

  it('faz match por nome exato', () => {
    const matches = matchIndicatorToRisks(
      baseIndicator({ substanceNameNormalized: 'tolueno' }),
      [risk({ id: 'risk-3', name: 'Tolueno', cas: null })],
    );

    expect(matches).toHaveLength(1);
    expect(matches[0].matchMethod).toBe(
      BiologicalIndicatorMatchMethodEnum.NAME_EXACT,
    );
  });

  it('faz match por sinônimo exato', () => {
    const matches = matchIndicatorToRisks(
      baseIndicator({ substanceNameNormalized: 'metilbenzeno' }),
      [
        risk({
          id: 'risk-4',
          name: 'Tolueno',
          cas: '108-88-3',
          synonymous: ['Metilbenzeno'],
        }),
      ],
    );

    expect(matches).toHaveLength(1);
    expect(matches[0].matchMethod).toBe(
      BiologicalIndicatorMatchMethodEnum.SYNONYM_EXACT,
    );
  });

  it('usa GROUP_RULE para grupos normativos sem expandir automaticamente', () => {
    const matches = matchIndicatorToRisks(
      baseIndicator({
        substanceName: 'Indutores de metahemoglobina',
        substanceNameNormalized: 'indutores de metahemoglobina',
        isSubstanceGroup: true,
      }),
      [
        risk({
          id: 'risk-5',
          name: 'Indutores de metahemoglobina - Anilina',
          cas: '62-53-3',
        }),
        risk({
          id: 'risk-6',
          name: 'Indutores de metahemoglobina - Nitrobenzeno',
          cas: '98-95-3',
        }),
      ],
    );

    expect(matches.length).toBeGreaterThan(0);
    expect(
      matches.every(
        (item) => item.matchMethod === BiologicalIndicatorMatchMethodEnum.GROUP_RULE,
      ),
    ).toBe(true);
    expect(matches.every((item) => item.requiresReview)).toBe(true);
  });

  it('força requiresReview no Quadro 2 / IBE_SC', () => {
    const matches = matchIndicatorToRisks(
      baseIndicator({
        casNumbers: ['71-43-2'],
        tableNumber: BiologicalIndicatorTableEnum.QUADRO_2,
        indicatorType: BiologicalIndicatorTypeEnum.IBE_SC,
        requiresNormativeReview: true,
      }),
      [risk()],
    );

    expect(matches[0].requiresReview).toBe(true);
  });

  it('usa RiskCatalogEquivalence via alias de nome', () => {
    const catalog = buildCatalogNameAliasMap([
      { canonicalLabel: 'Benzeno', aliasLabel: 'Benzol' },
    ]);

    const matches = matchIndicatorToRisks(
      baseIndicator({ substanceNameNormalized: 'benzol' }),
      [risk()],
      catalog,
    );

    expect(matches).toHaveLength(1);
    expect(matches[0].matchMethod).toBe(
      BiologicalIndicatorMatchMethodEnum.NAME_EXACT,
    );
  });

  it('calcula fuzzy score por tokens compartilhados', () => {
    expect(scoreFuzzyNameMatch('acido acetico', 'acetico')).toBeGreaterThan(0);
    expect(scoreFuzzyNameMatch('xyz', 'abc')).toBe(0);
  });

  it('quebra múltiplos CAS do risco e encontra interseção parcial', () => {
    expect(
      collectNormalizedCasNumbers('95-47-6; 108-38-3; 106-42-3'),
    ).toEqual(['95476', '108383', '106423']);

    expect(
      hasCasIntersection(
        ['95-47-6', '106-42-3', '108-38-3', '1330-20-7'],
        '95-47-6; 108-38-3; 106-42-3',
      ),
    ).toBe(true);
  });

  it('faz match de Xilenos por CAS_MULTI_ANY com interseção parcial', () => {
    const matches = matchIndicatorToRisks(
      baseIndicator({
        substanceName: 'Xilenos',
        substanceNameNormalized: 'xilenos',
        casNumbers: ['95-47-6', '106-42-3', '108-38-3', '1330-20-7'],
      }),
      [
        risk({
          id: 'risk-xileno',
          name: 'Xileno (o, m e p isômeros) — (Agente Insalubre)',
          cas: '95-47-6; 108-38-3; 106-42-3',
        }),
        risk({
          id: 'risk-ox',
          name: '1,2-dimetil-benzeno',
          cas: '95-47-6',
        }),
        risk({
          id: 'risk-mx',
          name: '1,3-dimetil-benzeno',
          cas: '108-38-3',
        }),
        risk({
          id: 'risk-px',
          name: '1,4-dimetil-benzeno (para-xileno)',
          cas: '106-42-3',
        }),
        risk({
          id: 'risk-px-bad',
          name: '1,4-dimetil-benzeno (para-xileno)',
          cas: '95-47-6; 108-38-3; 106-42-3',
        }),
      ],
    );

    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({
      riskFactorId: 'risk-xileno',
      matchConfidence: BiologicalIndicatorMatchConfidenceEnum.HIGH,
      matchMethod: BiologicalIndicatorMatchMethodEnum.CAS_MULTI_ANY,
      requiresReview: false,
    });
  });
});
