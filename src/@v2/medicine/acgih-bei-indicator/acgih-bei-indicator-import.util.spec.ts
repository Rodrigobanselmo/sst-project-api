import { describe, expect, it } from '@jest/globals';
import {
  PcmsoAcgihBeiIndicatorConfidenceEnum,
  PcmsoAcgihBeiIndicatorSourceEnum,
  PcmsoAcgihBeiIndicatorStatusEnum,
} from '@prisma/client';

import {
  buildDedupeKey,
  describeAcgihBeiPayload,
  diffAcgihBeiPayload,
  isRawRowEmpty,
  normalizeText,
  parseAcgihBeiRow,
  parseConfidence,
  parseOptionalBoolean,
  parseOptionalYear,
} from './acgih-bei-indicator-import.util';

describe('acgih-bei-indicator-import.util', () => {
  describe('normalizeText / buildDedupeKey', () => {
    it('lower/sem acento/trim/colapsa espaços', () => {
      expect(normalizeText('  Tolueno  Álcool ')).toBe('tolueno alcool');
      expect(normalizeText(null)).toBe('');
    });

    it('monta chave natural normalizada estável', () => {
      const a = buildDedupeKey({
        substanceName: 'Tolueno',
        cas: '108-88-3',
        determinant: 'o-Cresol',
        biologicalMatrix: 'Urina',
        samplingTime: 'Final da jornada',
      });
      const b = buildDedupeKey({
        substanceName: '  TOLUENO ',
        cas: '108-88-3',
        determinant: 'o-cresol',
        biologicalMatrix: 'urina',
        samplingTime: 'FINAL DA JORNADA',
      });
      expect(a).toBe(b);
      expect(a).toBe('tolueno|108-88-3|o-cresol|urina|final da jornada');
    });
  });

  describe('parseConfidence', () => {
    it('aceita EN e PT', () => {
      expect(parseConfidence('HIGH').value).toBe(
        PcmsoAcgihBeiIndicatorConfidenceEnum.HIGH,
      );
      expect(parseConfidence('Alta').value).toBe(
        PcmsoAcgihBeiIndicatorConfidenceEnum.HIGH,
      );
      expect(parseConfidence('Média').value).toBe(
        PcmsoAcgihBeiIndicatorConfidenceEnum.MEDIUM,
      );
      expect(parseConfidence('baixa').value).toBe(
        PcmsoAcgihBeiIndicatorConfidenceEnum.LOW,
      );
    });

    it('vazio = null, inválido = erro', () => {
      expect(parseConfidence('').value).toBeNull();
      expect(parseConfidence('talvez').error).toBe(true);
    });
  });

  describe('parseOptionalBoolean / parseOptionalYear', () => {
    it('booleano tolerante', () => {
      expect(parseOptionalBoolean('FALSE').value).toBe(false);
      expect(parseOptionalBoolean('sim').value).toBe(true);
      expect(parseOptionalBoolean('').value).toBeUndefined();
      expect(parseOptionalBoolean('xyz').error).toBe(true);
    });

    it('ano opcional', () => {
      expect(parseOptionalYear('2023').value).toBe(2023);
      expect(parseOptionalYear('').value).toBeNull();
      expect(parseOptionalYear('19').error).toBe(true);
      expect(parseOptionalYear('abc').error).toBe(true);
    });
  });

  describe('isRawRowEmpty', () => {
    it('linha só com id é vazia (id não é editável)', () => {
      expect(isRawRowEmpty({ id: 'abc' })).toBe(true);
    });
    it('linha com substância não é vazia', () => {
      expect(isRawRowEmpty({ substanceName: 'Tolueno' })).toBe(false);
    });
  });

  describe('parseAcgihBeiRow', () => {
    it('parseia linha completa com defaults', () => {
      const parsed = parseAcgihBeiRow(
        {
          id: '',
          substanceName: 'Tolueno',
          cas: '108-88-3',
          determinant: 'o-Cresol',
          biologicalMatrix: 'Urina',
          samplingTime: 'Final da jornada',
          beiValue: '0,3 mg/g creatinina',
          unit: 'mg/g',
          notation: 'B',
          status: '',
          source: '',
          sourceYear: '2023',
          isCurated: 'FALSE',
          internalNotes: 'nota',
          sourcePage: '12',
          confidence: 'Alta',
        },
        2,
      );

      expect(parsed.errors).toHaveLength(0);
      expect(parsed.payload).toMatchObject({
        substanceName: 'Tolueno',
        beiValue: '0,3 mg/g creatinina',
        status: PcmsoAcgihBeiIndicatorStatusEnum.DRAFT,
        source: PcmsoAcgihBeiIndicatorSourceEnum.ACGIH_BEI,
        sourceYear: 2023,
        isCurated: false,
        confidence: PcmsoAcgihBeiIndicatorConfidenceEnum.HIGH,
      });
      expect(parsed.dedupeKey).toBe(
        'tolueno|108-88-3|o-cresol|urina|final da jornada',
      );
    });

    it('linha vazia → payload null sem erro', () => {
      const parsed = parseAcgihBeiRow({ id: '', substanceName: '' }, 2);
      expect(parsed.payload).toBeNull();
      expect(parsed.errors).toHaveLength(0);
    });

    it('substanceName ausente com dados → erro', () => {
      const parsed = parseAcgihBeiRow({ id: '', cas: '108-88-3' }, 2);
      expect(parsed.payload).toBeNull();
      expect(parsed.errors.some((e) => e.field === 'substanceName')).toBe(true);
    });

    it('status/source/confidence inválidos → erros', () => {
      const parsed = parseAcgihBeiRow(
        {
          substanceName: 'X',
          status: 'FOO',
          source: 'BAR',
          confidence: 'ZZZ',
        },
        2,
      );
      expect(parsed.payload).toBeNull();
      const fields = parsed.errors.map((e) => e.field);
      expect(fields).toEqual(
        expect.arrayContaining(['status', 'source', 'confidence']),
      );
    });
  });

  describe('diff / describe', () => {
    const base = parseAcgihBeiRow(
      { substanceName: 'Tolueno', status: 'ACTIVE', confidence: 'HIGH' },
      2,
    ).payload!;

    it('describe lista apenas valores significativos no CREATE', () => {
      const changes = describeAcgihBeiPayload(base);
      const fields = changes.map((c) => c.field);
      expect(fields).toEqual(
        expect.arrayContaining(['substanceName', 'status', 'confidence']),
      );
      expect(fields).not.toContain('isCurated'); // false omitido
    });

    it('diff detecta apenas campos alterados', () => {
      const incoming = { ...base, status: PcmsoAcgihBeiIndicatorStatusEnum.DRAFT };
      const changes = diffAcgihBeiPayload(base, incoming);
      expect(changes).toHaveLength(1);
      expect(changes[0].field).toBe('status');
    });

    it('diff vazio quando idêntico (idempotência)', () => {
      expect(diffAcgihBeiPayload(base, { ...base })).toHaveLength(0);
    });
  });
});
