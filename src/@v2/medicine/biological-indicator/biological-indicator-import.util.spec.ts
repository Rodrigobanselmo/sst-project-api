import { describe, expect, it } from '@jest/globals';
import {
  BiologicalCollectionMomentEnum,
  BiologicalIndicatorAnnexEnum,
  BiologicalIndicatorDataOriginEnum,
  BiologicalIndicatorStatusEnum,
  BiologicalIndicatorTableEnum,
  BiologicalIndicatorTechnicalObservationEnum,
  BiologicalIndicatorTypeEnum,
  BiologicalNormativeSourceEnum,
} from '@prisma/client';

import { QUADRO_1_APPLICABILITY_DEFAULT } from './biological-indicator-applicability.schema';
import {
  assertNr07NormativeFields,
  hasNormativeContentChanges,
  IndicatorNormativePayload,
  Nr07NormativeFieldsError,
  toIndicatorNormativePayload,
} from './biological-indicator-import.util';

const basePayload = (): IndicatorNormativePayload => ({
  normativeSource: BiologicalNormativeSourceEnum.NR_07,
  annex: BiologicalIndicatorAnnexEnum.ANNEX_I,
  tableNumber: BiologicalIndicatorTableEnum.QUADRO_1,
  indicatorType: BiologicalIndicatorTypeEnum.IBE_EE,
  normativeVersion: 'NR-07-2022',
  substanceName: 'Benzeno',
  substanceNameNormalized: 'benzeno',
  casPrimary: '71-43-2',
  casNumbers: ['71-43-2'],
  substanceGroupId: null,
  isSubstanceGroup: false,
  biologicalIndicatorOriginal: 'Benzeno urinário',
  biologicalIndicatorNormalized: 'benzeno urinario',
  biologicalMatrix: 'Urina',
  collectionMoment: BiologicalCollectionMomentEnum.FJ,
  referenceValue: '0.5',
  referenceValueRaw: '0,5',
  unit: 'mg/g creatinina',
  technicalObservations: [BiologicalIndicatorTechnicalObservationEnum.NE],
  technicalObservationsRaw: null,
  defaultValidityMonths: 12,
  collectionToleranceDays: 45,
  occupationalApplicability: QUADRO_1_APPLICABILITY_DEFAULT,
  requiresNormativeReview: false,
  generalApplicabilityNotes: null,
  status: BiologicalIndicatorStatusEnum.DRAFT,
  dataOrigin: BiologicalIndicatorDataOriginEnum.SPREADSHEET_IMPORT,
  idempotencyKey: 'nr07|benzeno|benzeno urinario|urina|fj',
});

describe('biological-indicator-import.util', () => {
  it('ignora importBatchId no diff normativo', () => {
    const payload = basePayload();
    const existing = {
      ...payload,
      importBatchId: 'batch-1',
    };

    expect(hasNormativeContentChanges(existing, payload)).toBe(false);
  });

  it('detecta alteração normativa real', () => {
    const payload = basePayload();
    const existing = {
      ...payload,
      referenceValue: '1.0',
    };

    expect(hasNormativeContentChanges(existing, payload)).toBe(true);
  });

  it('normaliza casNumbers e technicalObservations na comparação', () => {
    const payload = basePayload();
    const existing = {
      ...payload,
      casNumbers: ['71-43-2'],
      technicalObservations: [BiologicalIndicatorTechnicalObservationEnum.NE],
    };

    expect(
      hasNormativeContentChanges(existing, {
        ...payload,
        casNumbers: ['71-43-2'],
        technicalObservations: [BiologicalIndicatorTechnicalObservationEnum.NE],
      }),
    ).toBe(false);

    expect(
      hasNormativeContentChanges(existing, {
        ...payload,
        casNumbers: ['71-43-2', '108-88-3'],
      }),
    ).toBe(true);
  });

  it('serializa payload de forma estável', () => {
    const first = toIndicatorNormativePayload(basePayload());
    const second = toIndicatorNormativePayload({
      ...basePayload(),
      casNumbers: ['71-43-2'],
    });

    expect(first).toEqual(second);
  });

  // 4P.1A — guard de obrigatoriedade lógica da NR-7 (campos agora nullable no schema).
  describe('assertNr07NormativeFields', () => {
    it('aceita registro NR-7 completo e retorna a mesma referência', () => {
      const payload = basePayload();
      expect(assertNr07NormativeFields(payload)).toBe(payload);
    });

    it.each([
      ['annex', { annex: null }],
      ['tableNumber', { tableNumber: null }],
      ['indicatorType', { indicatorType: null }],
      ['normativeVersion', { normativeVersion: null }],
      ['normativeVersion vazio', { normativeVersion: '   ' }],
    ])('rejeita NR-7 sem %s', (_label, patch) => {
      const source = { ...basePayload(), ...patch } as IndicatorNormativePayload;
      expect(() => assertNr07NormativeFields(source)).toThrow(
        Nr07NormativeFieldsError,
      );
    });

    it('acumula todos os campos ausentes no erro', () => {
      const source = {
        ...basePayload(),
        annex: null,
        tableNumber: null,
        indicatorType: null,
        normativeVersion: null,
      } as IndicatorNormativePayload;

      try {
        assertNr07NormativeFields(source);
        throw new Error('deveria ter lançado');
      } catch (error) {
        expect(error).toBeInstanceOf(Nr07NormativeFieldsError);
        expect((error as Nr07NormativeFieldsError).missingFields).toEqual([
          'annex',
          'tableNumber',
          'indicatorType',
          'normativeVersion',
        ]);
      }
    });

    it('não exige campos NR-7 para origem ACGIH/BEI (fundação 4P.1A)', () => {
      const source = {
        ...basePayload(),
        normativeSource: BiologicalNormativeSourceEnum.ACGIH_BEI,
        annex: null,
        tableNumber: null,
        indicatorType: null,
        normativeVersion: null,
      } as unknown as Parameters<typeof assertNr07NormativeFields>[0];

      expect(() => assertNr07NormativeFields(source)).not.toThrow();
    });
  });

  it('toIndicatorNormativePayload bloqueia NR-7 incompleto', () => {
    const source = {
      ...basePayload(),
      tableNumber: null,
    } as IndicatorNormativePayload;

    expect(() => toIndicatorNormativePayload(source)).toThrow(
      Nr07NormativeFieldsError,
    );
  });
});
