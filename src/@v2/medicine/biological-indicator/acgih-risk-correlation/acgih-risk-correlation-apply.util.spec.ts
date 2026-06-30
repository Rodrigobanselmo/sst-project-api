import { describe, expect, it } from '@jest/globals';
import {
  BiologicalIndicatorMatchConfidenceEnum,
  BiologicalIndicatorMatchMethodEnum,
} from '@prisma/client';

import { AcgihRiskCorrelationItem } from './acgih-risk-correlation.service';
import { AcgihRiskCorrelationLink } from './acgih-risk-correlation.util';
import {
  buildApplyNotes,
  evaluateApplyEligibility,
  mapMatchConfidence,
  mapMatchMethod,
  resolveIsPrimary,
} from './acgih-risk-correlation-apply.util';

const link = (
  over: Partial<AcgihRiskCorrelationLink> = {},
): AcgihRiskCorrelationLink => ({
  riskFactorId: 'risk-1',
  riskName: 'Fator X',
  riskCasRaw: '100-00-0',
  riskCasParsed: ['100000'],
  matchMethod: 'CAS_EXACT',
  confidence: 'HIGH',
  isGroup: false,
  ...over,
});

const item = (
  over: Partial<AcgihRiskCorrelationItem> = {},
): AcgihRiskCorrelationItem => ({
  acgihBeiIndicatorId: 'acgih-1',
  substanceName: 'Substância X',
  cas: '100-00-0',
  matrix: null,
  determinant: null,
  officialIndicatorId: 'official-1',
  promoted: true,
  alreadyLinked: false,
  autoStatus: 'MATCH_CAS_EXACT',
  finalStatus: 'MATCH_CAS_EXACT',
  decisionSource: 'AUTO',
  cardinality: 'SINGLE',
  links: [link()],
  blockers: [],
  warnings: [],
  note: '',
  ...over,
});

describe('evaluateApplyEligibility', () => {
  it('aceita item promovido, sem bloqueios, status elegível e com links', () => {
    expect(evaluateApplyEligibility(item())).toEqual({ eligible: true });
  });

  it('pula NOT_PROMOTED quando não há officialIndicatorId', () => {
    expect(
      evaluateApplyEligibility(
        item({ officialIndicatorId: null, promoted: false }),
      ),
    ).toEqual({ eligible: false, skipReason: 'NOT_PROMOTED' });
  });

  it('pula HAS_BLOCKERS quando há bloqueios', () => {
    expect(
      evaluateApplyEligibility(item({ blockers: ['OVERRIDE_TARGET_MISSING'] })),
    ).toEqual({ eligible: false, skipReason: 'HAS_BLOCKERS' });
  });

  it('pula NOT_ELIGIBLE_STATUS para status fora do whitelist (NO_MATCH/AMBIGUOUS/MATCH_NAME)', () => {
    for (const finalStatus of [
      'NO_MATCH',
      'AMBIGUOUS',
      'MATCH_NAME',
      'ALREADY_LINKED',
      'OVERRIDE_TARGET_MISSING',
    ] as const) {
      expect(
        evaluateApplyEligibility(item({ finalStatus, links: [] })),
      ).toEqual({ eligible: false, skipReason: 'NOT_ELIGIBLE_STATUS' });
    }
  });

  it('pula NO_LINKS quando status é elegível mas não há links', () => {
    expect(
      evaluateApplyEligibility(
        item({ finalStatus: 'MATCH_CAS_EXACT', links: [] }),
      ),
    ).toEqual({ eligible: false, skipReason: 'NO_LINKS' });
  });
});

describe('mapMatchConfidence', () => {
  it('mapeia confiança conforme a decisão de produto A.3', () => {
    expect(mapMatchConfidence('MATCH_REUSED_NR7')).toBe(
      BiologicalIndicatorMatchConfidenceEnum.HIGH,
    );
    expect(mapMatchConfidence('MATCH_CAS_EXACT')).toBe(
      BiologicalIndicatorMatchConfidenceEnum.HIGH,
    );
    expect(mapMatchConfidence('MATCH_CAS_IN_GROUP')).toBe(
      BiologicalIndicatorMatchConfidenceEnum.PROBABLE,
    );
    expect(mapMatchConfidence('ACEITAR_CANONICO')).toBe(
      BiologicalIndicatorMatchConfidenceEnum.MANUAL,
    );
    expect(mapMatchConfidence('ACEITAR_GRUPO')).toBe(
      BiologicalIndicatorMatchConfidenceEnum.MANUAL,
    );
    expect(mapMatchConfidence('ACEITAR_MULTIPLO_CANONICO')).toBe(
      BiologicalIndicatorMatchConfidenceEnum.MANUAL,
    );
  });
});

describe('mapMatchMethod', () => {
  it('reuso NR-7 com fator de CAS único => CAS_EXACT', () => {
    expect(
      mapMatchMethod('MATCH_REUSED_NR7', link({ riskCasParsed: ['100000'] })),
    ).toBe(BiologicalIndicatorMatchMethodEnum.CAS_EXACT);
  });

  it('reuso NR-7 com fator multi-CAS => CAS_MULTI_ANY', () => {
    expect(
      mapMatchMethod(
        'MATCH_REUSED_NR7',
        link({ riskCasParsed: ['100000', '200000'] }),
      ),
    ).toBe(BiologicalIndicatorMatchMethodEnum.CAS_MULTI_ANY);
  });

  it('mapeia método conforme a decisão de produto A.3', () => {
    expect(mapMatchMethod('MATCH_CAS_EXACT', link())).toBe(
      BiologicalIndicatorMatchMethodEnum.CAS_EXACT,
    );
    expect(mapMatchMethod('MATCH_CAS_IN_GROUP', link())).toBe(
      BiologicalIndicatorMatchMethodEnum.GROUP_RULE,
    );
    expect(mapMatchMethod('ACEITAR_CANONICO', link())).toBe(
      BiologicalIndicatorMatchMethodEnum.MANUAL,
    );
    expect(mapMatchMethod('ACEITAR_GRUPO', link())).toBe(
      BiologicalIndicatorMatchMethodEnum.GROUP_RULE,
    );
    expect(mapMatchMethod('ACEITAR_MULTIPLO_CANONICO', link())).toBe(
      BiologicalIndicatorMatchMethodEnum.MANUAL,
    );
  });
});

describe('resolveIsPrimary', () => {
  it('SINGLE => true', () => {
    expect(resolveIsPrimary('SINGLE')).toBe(true);
  });
  it('MULTIPLE => false', () => {
    expect(resolveIsPrimary('MULTIPLE')).toBe(false);
  });
  it('NONE => false', () => {
    expect(resolveIsPrimary('NONE')).toBe(false);
  });
});

describe('buildApplyNotes', () => {
  it('inclui status, fonte, cardinalidade, grupo, executor e marca A.3', () => {
    const notes = buildApplyNotes({
      finalStatus: 'ACEITAR_GRUPO',
      decisionSource: 'MANUAL_OVERRIDE',
      cardinality: 'SINGLE',
      isGroup: true,
      userId: 42,
      date: new Date('2026-01-01T12:00:00Z'),
    });
    expect(notes).toContain('Frente A.3');
    expect(notes).toContain('finalStatus=ACEITAR_GRUPO');
    expect(notes).toContain('decisionSource=MANUAL_OVERRIDE');
    expect(notes).toContain('cardinality=SINGLE');
    expect(notes).toContain('grupo=sim');
    expect(notes).toContain('executor=42');
  });
});
