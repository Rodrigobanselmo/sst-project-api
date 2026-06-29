import { describe, expect, it } from '@jest/globals';
import {
  PcmsoAcgihBeiComparisonDecisionEnum,
  PcmsoAcgihBeiIndicatorConfidenceEnum,
} from '@prisma/client';

import {
  AcgihBeiComparisonStatus,
  AcgihBeiOperationalStatus,
  AcgihBeiSuggestedAction,
  AcgihItemInput,
  canonMatrix,
  canonMoment,
  compareItem,
  deriveOperationalStatus,
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

describe('deriveOperationalStatus', () => {
  // 4O.3 — regra mantida.
  it('DIVERGENT + FALSE_DIVERGENCE_EQUIVALENT → RESOLVED_EQUIVALENCE', () => {
    expect(
      deriveOperationalStatus(
        AcgihBeiComparisonStatus.DIVERGENT,
        PcmsoAcgihBeiComparisonDecisionEnum.FALSE_DIVERGENCE_EQUIVALENT,
        false,
      ),
    ).toBe(AcgihBeiOperationalStatus.RESOLVED_EQUIVALENCE);
  });

  // Caso A (4O.4) — NEEDS_REVIEW revisado como divergência real sai da fila.
  it('Caso A: NEEDS_REVIEW + REAL_DIVERGENCE (fresca) → REAL_DIVERGENCE', () => {
    expect(
      deriveOperationalStatus(
        AcgihBeiComparisonStatus.NEEDS_REVIEW,
        PcmsoAcgihBeiComparisonDecisionEnum.REAL_DIVERGENCE,
        false,
      ),
    ).toBe(AcgihBeiOperationalStatus.REAL_DIVERGENCE);
  });

  // Caso B (4O.4) — NEEDS_REVIEW revisado como equivalência → resolvido.
  it('Caso B: NEEDS_REVIEW + FALSE_DIVERGENCE_EQUIVALENT (fresca) → RESOLVED_EQUIVALENCE', () => {
    expect(
      deriveOperationalStatus(
        AcgihBeiComparisonStatus.NEEDS_REVIEW,
        PcmsoAcgihBeiComparisonDecisionEnum.FALSE_DIVERGENCE_EQUIVALENT,
        false,
      ),
    ).toBe(AcgihBeiOperationalStatus.RESOLVED_EQUIVALENCE);
  });

  // Caso C (4O.4) — NEEDS_REVIEW sem decisão permanece pendente.
  it('Caso C: NEEDS_REVIEW sem decisão → NEEDS_REVIEW', () => {
    expect(
      deriveOperationalStatus(AcgihBeiComparisonStatus.NEEDS_REVIEW, null, null),
    ).toBe(AcgihBeiOperationalStatus.NEEDS_REVIEW);
  });

  it('NEEDS_REVIEW + decisão DESATUALIZADA (isStale) permanece NEEDS_REVIEW', () => {
    expect(
      deriveOperationalStatus(
        AcgihBeiComparisonStatus.NEEDS_REVIEW,
        PcmsoAcgihBeiComparisonDecisionEnum.REAL_DIVERGENCE,
        true,
      ),
    ).toBe(AcgihBeiOperationalStatus.NEEDS_REVIEW);
  });

  it('demais decisões em NEEDS_REVIEW refletem o bucket operacional', () => {
    expect(
      deriveOperationalStatus(
        AcgihBeiComparisonStatus.NEEDS_REVIEW,
        PcmsoAcgihBeiComparisonDecisionEnum.SOURCE_ACGIH_ERROR,
        false,
      ),
    ).toBe(AcgihBeiOperationalStatus.SOURCE_ACGIH_ERROR);
    expect(
      deriveOperationalStatus(
        AcgihBeiComparisonStatus.NEEDS_REVIEW,
        PcmsoAcgihBeiComparisonDecisionEnum.SOURCE_NR7_ERROR,
        false,
      ),
    ).toBe(AcgihBeiOperationalStatus.SOURCE_NR7_ERROR);
    expect(
      deriveOperationalStatus(
        AcgihBeiComparisonStatus.NEEDS_REVIEW,
        PcmsoAcgihBeiComparisonDecisionEnum.NEEDS_FURTHER_REVIEW,
        false,
      ),
    ).toBe(AcgihBeiOperationalStatus.NEEDS_FURTHER_REVIEW);
    expect(
      deriveOperationalStatus(
        AcgihBeiComparisonStatus.NEEDS_REVIEW,
        PcmsoAcgihBeiComparisonDecisionEnum.IGNORE_MONITOR,
        false,
      ),
    ).toBe(AcgihBeiOperationalStatus.IGNORE_MONITOR);
  });

  it('status sem decisão preserva o bruto (ALREADY_COVERED)', () => {
    expect(
      deriveOperationalStatus(
        AcgihBeiComparisonStatus.ALREADY_COVERED,
        null,
        null,
      ),
    ).toBe(AcgihBeiOperationalStatus.ALREADY_COVERED);
  });

  // 4O.5 — desfechos de auditoria independem do status bruto.
  it('ALREADY_COVERED + MATCH_CONFIRMED (fresca) → COVERAGE_CONFIRMED', () => {
    expect(
      deriveOperationalStatus(
        AcgihBeiComparisonStatus.ALREADY_COVERED,
        PcmsoAcgihBeiComparisonDecisionEnum.MATCH_CONFIRMED,
        false,
      ),
    ).toBe(AcgihBeiOperationalStatus.COVERAGE_CONFIRMED);
  });

  it('NEW_CANDIDATE + NO_MATCH_CONFIRMED (fresca) → ACGIH_CANDIDATE_CONFIRMED', () => {
    expect(
      deriveOperationalStatus(
        AcgihBeiComparisonStatus.NEW_CANDIDATE,
        PcmsoAcgihBeiComparisonDecisionEnum.NO_MATCH_CONFIRMED,
        false,
      ),
    ).toBe(AcgihBeiOperationalStatus.ACGIH_CANDIDATE_CONFIRMED);
  });

  it('NEEDS_REVIEW + MATCH_CONFIRMED (fresca) → COVERAGE_CONFIRMED', () => {
    expect(
      deriveOperationalStatus(
        AcgihBeiComparisonStatus.NEEDS_REVIEW,
        PcmsoAcgihBeiComparisonDecisionEnum.MATCH_CONFIRMED,
        false,
      ),
    ).toBe(AcgihBeiOperationalStatus.COVERAGE_CONFIRMED);
  });

  it('desfecho de auditoria DESATUALIZADO (isStale) não colapsa', () => {
    expect(
      deriveOperationalStatus(
        AcgihBeiComparisonStatus.ALREADY_COVERED,
        PcmsoAcgihBeiComparisonDecisionEnum.MATCH_CONFIRMED,
        true,
      ),
    ).toBe(AcgihBeiOperationalStatus.ALREADY_COVERED);
    expect(
      deriveOperationalStatus(
        AcgihBeiComparisonStatus.NEW_CANDIDATE,
        PcmsoAcgihBeiComparisonDecisionEnum.NO_MATCH_CONFIRMED,
        true,
      ),
    ).toBe(AcgihBeiOperationalStatus.NEW_CANDIDATE);
  });
});
