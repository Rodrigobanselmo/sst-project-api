import { describe, expect, it } from '@jest/globals';
import { PcmsoAcgihBeiIndicatorConfidenceEnum } from '@prisma/client';

import {
  AcgihBeiComparisonStatus,
  AcgihBeiSuggestedAction,
  AcgihItemInput,
  canonMatrix,
  canonMoment,
  compareItem,
  MatchStatus,
  matchNr7,
  normalizeCas,
  normalizeText,
  Nr7IndicatorInput,
  parseValue,
  RuleInput,
} from './acgih-bei-comparison.util';

const baseAcgih = (over: Partial<AcgihItemInput> = {}): AcgihItemInput => ({
  id: 'acgih-1',
  substanceName: 'Tolueno',
  cas: '108-88-3',
  determinant: 'o-Cresol',
  biologicalMatrix: 'Urina',
  samplingTime: 'Final da jornada',
  beiValue: '0.3',
  unit: 'mg/L',
  notation: null,
  confidence: PcmsoAcgihBeiIndicatorConfidenceEnum.HIGH,
  ...over,
});

const baseNr7 = (over: Partial<Nr7IndicatorInput> = {}): Nr7IndicatorInput => ({
  id: 'nr7-1',
  substanceName: 'Tolueno',
  substanceNameNormalized: 'tolueno',
  casPrimary: '108-88-3',
  casNumbers: ['108-88-3'],
  determinantNormalized: 'o-cresol',
  determinantOriginal: 'o-Cresol',
  biologicalMatrix: 'Urina',
  collectionMoment: 'FJ',
  referenceValue: '0.3',
  unit: 'mg/L',
  ...over,
});

const emptyMaps = () => ({
  bySource: new Map<string, RuleInput>(),
  byCas: new Map<string, RuleInput>(),
  byName: new Map<string, RuleInput>(),
});

describe('normalização', () => {
  it('normalizeText remove acento/caixa/espaços', () => {
    expect(normalizeText('  Ácido  Hipúrico ')).toBe('acido hipurico');
  });

  it('normalizeCas remove espaços', () => {
    expect(normalizeCas(' 108-88-3 ')).toBe('108-88-3');
  });

  it('canonMatrix mapeia variações', () => {
    expect(canonMatrix('Urina')).toBe('urina');
    expect(canonMatrix('Soro ou plasma')).toBe('soro/plasma');
    expect(canonMatrix('Sangue')).toBe('sangue');
    expect(canonMatrix('Ar exalado final')).toBe('ar exalado');
  });

  it('canonMoment mapeia enum e texto livre', () => {
    expect(canonMoment('FJ')).toBe('fim jornada');
    expect(canonMoment('Final da jornada')).toBe('fim jornada');
    expect(canonMoment('Não crítico')).toBe('nao critico');
    expect(canonMoment('FJFS')).toBe(canonMoment('Fim da jornada e fim de semana'));
  });

  it('parseValue extrai número e unidade', () => {
    expect(parseValue('0,3 mg/L')).toEqual({ num: 0.3, unit: 'mg/l' });
    expect(parseValue('')).toEqual({ num: null, unit: '' });
  });
});

describe('matchNr7', () => {
  it('FULL quando cas + determinante + matriz + momento batem', () => {
    const result = matchNr7(baseAcgih(), [baseNr7()]);
    expect(result.status).toBe(MatchStatus.FULL);
    expect(result.valueEqual).toBe(true);
  });

  it('PARTIAL quando cas bate mas matriz diverge', () => {
    const result = matchNr7(baseAcgih(), [
      baseNr7({ biologicalMatrix: 'Sangue' }),
    ]);
    expect(result.status).toBe(MatchStatus.PARTIAL);
    expect(result.matrixMatch).toBe(false);
  });

  it('NONE quando não há candidato', () => {
    const result = matchNr7(baseAcgih({ cas: '999-99-9', substanceName: 'Xyz' }), [
      baseNr7(),
    ]);
    expect(result.status).toBe(MatchStatus.NONE);
  });
});

describe('compareItem', () => {
  it('ALREADY_COVERED + ADD_REFERENCE_ONLY quando ACGIH confirma NR-7', () => {
    const { bySource, byCas, byName } = emptyMaps();
    const res = compareItem(baseAcgih(), [baseNr7()], bySource, byCas, byName);
    expect(res.comparisonStatus).toBe(AcgihBeiComparisonStatus.ALREADY_COVERED);
    expect(res.suggestedAction).toBe(AcgihBeiSuggestedAction.ADD_REFERENCE_ONLY);
  });

  it('NEW_CANDIDATE + CREATE_NEW_RULE_CANDIDATE quando não há cobertura', () => {
    const { bySource, byCas, byName } = emptyMaps();
    const res = compareItem(
      baseAcgih({ cas: '12-34-5', substanceName: 'Substância Nova' }),
      [baseNr7()],
      bySource,
      byCas,
      byName,
    );
    expect(res.comparisonStatus).toBe(AcgihBeiComparisonStatus.NEW_CANDIDATE);
    expect(res.suggestedAction).toBe(
      AcgihBeiSuggestedAction.CREATE_NEW_RULE_CANDIDATE,
    );
  });

  it('DIVERGENT + REVIEW_DIVERGENCE quando determinante igual mas valor difere', () => {
    const { bySource, byCas, byName } = emptyMaps();
    const res = compareItem(
      baseAcgih({ beiValue: '0.9' }),
      [baseNr7({ referenceValue: '0.3' })],
      bySource,
      byCas,
      byName,
    );
    expect(res.comparisonStatus).toBe(AcgihBeiComparisonStatus.DIVERGENT);
    expect(res.suggestedAction).toBe(AcgihBeiSuggestedAction.REVIEW_DIVERGENCE);
    expect(res.technicalDiff).toContain('valor');
  });

  it('LOW_CONFIDENCE_REVIEW tem precedência', () => {
    const { bySource, byCas, byName } = emptyMaps();
    const res = compareItem(
      baseAcgih({ confidence: PcmsoAcgihBeiIndicatorConfidenceEnum.LOW }),
      [baseNr7()],
      bySource,
      byCas,
      byName,
    );
    expect(res.comparisonStatus).toBe(
      AcgihBeiComparisonStatus.LOW_CONFIDENCE_REVIEW,
    );
    expect(res.suggestedAction).toBe(
      AcgihBeiSuggestedAction.LOW_CONFIDENCE_REVIEW,
    );
  });

  it('match de regra VIA_NR7 quando há regra com sourceIndicatorId', () => {
    const rule: RuleInput = {
      id: 'rule-1',
      source: 'NR_07',
      status: 'ACTIVE',
      agentCas: '108-88-3',
      agentName: 'Tolueno',
      agentNameNormalized: 'tolueno',
      sourceIndicatorId: 'nr7-1',
      examNames: ['Ácido hipúrico'],
    };
    const bySource = new Map<string, RuleInput>([['nr7-1', rule]]);
    const byCas = new Map<string, RuleInput>([['108-88-3', rule]]);
    const byName = new Map<string, RuleInput>([['tolueno', rule]]);
    const res = compareItem(baseAcgih(), [baseNr7()], bySource, byCas, byName);
    expect(res.examRiskRuleMatchStatus).toBe(MatchStatus.FULL);
    expect(res.ruleMatchMethod).toBe('VIA_NR7');
    expect(res.examNameSnapshot).toBe('Ácido hipúrico');
  });
});
