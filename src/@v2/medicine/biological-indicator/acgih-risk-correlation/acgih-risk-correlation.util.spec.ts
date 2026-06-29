import { describe, expect, it } from '@jest/globals';

import { ACGIH_RISK_CORRELATION_OVERRIDES } from './acgih-risk-correlation-overrides.const';
import {
  AcgihIndicatorSnapshot,
  Nr7IndicatorSnapshot,
  OverrideTargetResolution,
  RiskFactorSnapshot,
  applyOverride,
  classifyAuto,
  countBy,
  findOverrideForAcgih,
} from './acgih-risk-correlation.util';

const acgih = (
  over: Partial<AcgihIndicatorSnapshot> = {},
): AcgihIndicatorSnapshot => ({
  id: 'acgih-1',
  substanceName: 'Substância X',
  substanceNameNormalized: null,
  cas: null,
  determinant: null,
  biologicalMatrix: null,
  ...over,
});

const risk = (over: Partial<RiskFactorSnapshot> = {}): RiskFactorSnapshot => ({
  id: 'risk-1',
  name: 'Fator X',
  cas: null,
  synonymous: [],
  ...over,
});

const emptyPromotion = { officialId: null, linkedRisks: [] };

const resolutionMapFor = (
  override = ACGIH_RISK_CORRELATION_OVERRIDES[0],
  patch: (r: OverrideTargetResolution) => OverrideTargetResolution = (r) => r,
): Map<string, OverrideTargetResolution> => {
  const map = new Map<string, OverrideTargetResolution>();
  for (const t of override.targets) {
    map.set(
      t.riskFactorId,
      patch({
        riskFactorId: t.riskFactorId,
        exists: true,
        isSystem: true,
        isDeleted: false,
        name: t.expectedRiskName,
        cas: t.expectedRiskCas,
      }),
    );
  }
  return map;
};

describe('classifyAuto', () => {
  it('reusa vínculo NR-7 por CAS (MATCH_REUSED_NR7)', () => {
    const nr7: Nr7IndicatorSnapshot[] = [
      {
        substanceName: 'Benzeno NR7',
        casNumbers: ['71-43-2'],
        riskLinks: [
          { riskFactorId: 'r-benz', riskName: 'Benzeno', riskCasRaw: '71-43-2' },
        ],
      },
    ];
    const res = classifyAuto({
      acgih: acgih({ cas: '71-43-2' }),
      risks: [risk({ id: 'r-benz', name: 'Benzeno', cas: '71-43-2' })],
      nr7,
      promotion: emptyPromotion,
    });
    expect(res.status).toBe('MATCH_REUSED_NR7');
    expect(res.links).toHaveLength(1);
    expect(res.links[0].riskFactorId).toBe('r-benz');
  });

  it('classifica CAS exato em fator único (MATCH_CAS_EXACT)', () => {
    const res = classifyAuto({
      acgih: acgih({ cas: '108-93-0' }),
      risks: [risk({ id: 'r-c', name: 'Ciclohexanol', cas: '108-93-0' })],
      nr7: [],
      promotion: emptyPromotion,
    });
    expect(res.status).toBe('MATCH_CAS_EXACT');
    expect(res.links[0].isGroup).toBe(false);
  });

  it('classifica CAS dentro de grupo (MATCH_CAS_IN_GROUP)', () => {
    const res = classifyAuto({
      acgih: acgih({ cas: '142-82-5' }),
      risks: [
        risk({
          id: 'r-hept',
          name: 'Heptano, todos os isômeros',
          cas: '142-82-5; 590-35-2; 565-59-3',
        }),
      ],
      nr7: [],
      promotion: emptyPromotion,
    });
    expect(res.status).toBe('MATCH_CAS_IN_GROUP');
    expect(res.links[0].isGroup).toBe(true);
  });

  it('marca AMBIGUOUS quando CAS aparece em vários fatores', () => {
    const res = classifyAuto({
      acgih: acgih({ cas: '110-82-7' }),
      risks: [
        risk({ id: 'r-a', name: 'Ciclohexano (Agente Insalubre)', cas: '110-82-7' }),
        risk({ id: 'r-b', name: 'Ciclohexano duplicado', cas: '110-82-7' }),
      ],
      nr7: [],
      promotion: emptyPromotion,
    });
    expect(res.status).toBe('AMBIGUOUS');
    expect(res.links).toHaveLength(2);
  });

  it('retorna NO_MATCH sem CAS e sem nome no catálogo', () => {
    const res = classifyAuto({
      acgih: acgih({ substanceName: 'Fluoretos', cas: null }),
      risks: [risk({ id: 'r-x', name: 'Fluoretos, como F', cas: '7782-41-4' })],
      nr7: [],
      promotion: emptyPromotion,
    });
    expect(res.status).toBe('NO_MATCH');
    expect(res.links).toHaveLength(0);
  });

  it('reflete ALREADY_LINKED quando promovido com vínculo', () => {
    const res = classifyAuto({
      acgih: acgih({ cas: '71-43-2' }),
      risks: [],
      nr7: [],
      promotion: {
        officialId: 'official-1',
        linkedRisks: [
          { riskFactorId: 'r-benz', riskName: 'Benzeno', riskCasRaw: '71-43-2' },
        ],
      },
    });
    expect(res.status).toBe('ALREADY_LINKED');
    expect(res.links[0].riskFactorId).toBe('r-benz');
  });
});

describe('findOverrideForAcgih', () => {
  it('casa n-Heptano por nome e CAS', () => {
    const ov = findOverrideForAcgih(acgih({ substanceName: 'n-Heptano', cas: '142-82-5' }));
    expect(ov?.label).toBe('n-Heptano');
  });

  it('casa TDI mesmo com CAS combinado "91-08-7 / 584-84-9"', () => {
    const ov = findOverrideForAcgih(
      acgih({
        substanceName: 'Toluenodiisocianato (TDI) - isômeros 2,4 ou 2,6',
        cas: '91-08-7 / 584-84-9',
      }),
    );
    expect(ov?.finalStatus).toBe('ACEITAR_MULTIPLO_CANONICO');
  });

  it('não casa substância sem override', () => {
    expect(findOverrideForAcgih(acgih({ substanceName: 'Benzeno', cas: '71-43-2' }))).toBeNull();
  });
});

describe('applyOverride', () => {
  it('sobrescreve NO_MATCH automático por ACEITAR_CANONICO (Fluoretos)', () => {
    const override = ACGIH_RISK_CORRELATION_OVERRIDES.find((o) => o.label === 'Fluoretos')!;
    const final = applyOverride({
      auto: { status: 'NO_MATCH', links: [], note: 'auto' },
      override,
      targetResolutions: resolutionMapFor(override),
    });
    expect(final.finalStatus).toBe('ACEITAR_CANONICO');
    expect(final.decisionSource).toBe('MANUAL_OVERRIDE');
    expect(final.cardinality).toBe('SINGLE');
    expect(final.links[0].matchMethod).toBe('MANUAL_OVERRIDE');
  });

  it('sobrescreve AMBIGUOUS automático (Níquel) por canônico único', () => {
    const override = ACGIH_RISK_CORRELATION_OVERRIDES.find((o) =>
      o.label.startsWith('Níquel'),
    )!;
    const final = applyOverride({
      auto: { status: 'AMBIGUOUS', links: [], note: 'auto' },
      override,
      targetResolutions: resolutionMapFor(override),
    });
    expect(final.finalStatus).toBe('ACEITAR_CANONICO');
    expect(final.cardinality).toBe('SINGLE');
  });

  it('TDI retorna dois links (MULTIPLE)', () => {
    const override = ACGIH_RISK_CORRELATION_OVERRIDES.find((o) => o.label.startsWith('TDI'))!;
    const final = applyOverride({
      auto: { status: 'NO_MATCH', links: [], note: 'auto' },
      override,
      targetResolutions: resolutionMapFor(override),
    });
    expect(final.finalStatus).toBe('ACEITAR_MULTIPLO_CANONICO');
    expect(final.links).toHaveLength(2);
    expect(final.cardinality).toBe('MULTIPLE');
  });

  it('n-Heptano marca isGroup e ACEITAR_GRUPO', () => {
    const override = ACGIH_RISK_CORRELATION_OVERRIDES.find((o) => o.label === 'n-Heptano')!;
    const final = applyOverride({
      auto: { status: 'MATCH_CAS_IN_GROUP', links: [], note: 'auto' },
      override,
      targetResolutions: resolutionMapFor(override),
    });
    expect(final.finalStatus).toBe('ACEITAR_GRUPO');
    expect(final.links[0].isGroup).toBe(true);
    expect(final.cardinality).toBe('SINGLE');
  });

  it('gera blocker OVERRIDE_TARGET_MISSING quando alvo não existe', () => {
    const override = ACGIH_RISK_CORRELATION_OVERRIDES.find((o) => o.label === 'Ciclohexano')!;
    const final = applyOverride({
      auto: { status: 'AMBIGUOUS', links: [], note: 'auto' },
      override,
      targetResolutions: resolutionMapFor(override, (r) => ({ ...r, exists: false })),
    });
    expect(final.finalStatus).toBe('OVERRIDE_TARGET_MISSING');
    expect(final.blockers.length).toBeGreaterThan(0);
  });

  it('gera blocker quando alvo não é system', () => {
    const override = ACGIH_RISK_CORRELATION_OVERRIDES.find((o) => o.label === 'Ciclohexano')!;
    const final = applyOverride({
      auto: { status: 'AMBIGUOUS', links: [], note: 'auto' },
      override,
      targetResolutions: resolutionMapFor(override, (r) => ({ ...r, isSystem: false })),
    });
    expect(final.finalStatus).toBe('OVERRIDE_TARGET_MISSING');
  });

  it('emite warning quando nome do fator diverge do esperado', () => {
    const override = ACGIH_RISK_CORRELATION_OVERRIDES.find((o) => o.label === 'Ciclohexano')!;
    const final = applyOverride({
      auto: { status: 'AMBIGUOUS', links: [], note: 'auto' },
      override,
      targetResolutions: resolutionMapFor(override, (r) => ({ ...r, name: 'Outro nome' })),
    });
    expect(final.finalStatus).toBe('ACEITAR_CANONICO');
    expect(final.warnings.length).toBeGreaterThan(0);
  });

  it('mantém AUTO quando não há override', () => {
    const final = applyOverride({
      auto: { status: 'MATCH_CAS_EXACT', links: [], note: 'auto' },
      override: null,
      targetResolutions: new Map(),
    });
    expect(final.decisionSource).toBe('AUTO');
    expect(final.finalStatus).toBe('MATCH_CAS_EXACT');
  });
});

describe('countBy', () => {
  it('conta por status e cardinalidade', () => {
    expect(countBy(['A', 'A', 'B'])).toEqual({ A: 2, B: 1 });
    expect(countBy(['SINGLE', 'MULTIPLE', 'SINGLE'])).toEqual({
      SINGLE: 2,
      MULTIPLE: 1,
    });
  });
});
