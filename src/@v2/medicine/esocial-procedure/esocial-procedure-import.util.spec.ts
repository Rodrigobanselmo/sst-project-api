import { describe, expect, it } from '@jest/globals';
import {
  PcmsoEsocialProcedureStatusEnum,
  PcmsoEsocialProcedureTypeEnum,
} from '@prisma/client';

import {
  describeCurationPayload,
  diffCurationPayload,
  isRawCurationEmpty,
  normalizeRelevantValue,
  normalizeStatus,
  normalizeTechnicalType,
  parseCurationRow,
} from './esocial-procedure-import.util';

describe('esocial-procedure-import.util', () => {
  describe('normalizeRelevantValue', () => {
    it('aceita variações de verdadeiro/falso (case/acentos)', () => {
      expect(normalizeRelevantValue('true')).toEqual({ value: true, error: false });
      expect(normalizeRelevantValue('SIM')).toEqual({ value: true, error: false });
      expect(normalizeRelevantValue('Não')).toEqual({ value: false, error: false });
      expect(normalizeRelevantValue('0')).toEqual({ value: false, error: false });
      expect(normalizeRelevantValue(true)).toEqual({ value: true, error: false });
    });

    it('vazio = false sem erro; valor desconhecido = erro', () => {
      expect(normalizeRelevantValue('')).toEqual({ value: false, error: false });
      expect(normalizeRelevantValue(null)).toEqual({ value: false, error: false });
      expect(normalizeRelevantValue('talvez')).toEqual({ value: null, error: true });
    });
  });

  describe('normalizeTechnicalType', () => {
    it('vazio = null (não classificado)', () => {
      expect(normalizeTechnicalType('')).toEqual({ value: null, error: false });
    });
    it('aceita enum válido (case-insensitive)', () => {
      expect(normalizeTechnicalType('audiometry')).toEqual({
        value: PcmsoEsocialProcedureTypeEnum.AUDIOMETRY,
        error: false,
      });
    });
    it('rejeita valor fora do enum', () => {
      expect(normalizeTechnicalType('RAIOX')).toEqual({ value: null, error: true });
    });
  });

  describe('normalizeStatus', () => {
    it('vazio = DRAFT', () => {
      expect(normalizeStatus('')).toEqual({
        value: PcmsoEsocialProcedureStatusEnum.DRAFT,
        error: false,
      });
    });
    it('aceita enum válido e rejeita inválido', () => {
      expect(normalizeStatus('active')).toEqual({
        value: PcmsoEsocialProcedureStatusEnum.ACTIVE,
        error: false,
      });
      expect(normalizeStatus('LIGADO')).toEqual({ value: null, error: true });
    });
  });

  describe('parseCurationRow', () => {
    it('parseia linha válida completa', () => {
      const row = parseCurationRow(
        {
          procedureCode: '0001',
          isOccupationalRelevant: 'sim',
          technicalType: 'AUDIOMETRY',
          status: 'ACTIVE',
          internalNotes: '  obs  ',
        },
        2,
      );
      expect(row.errors).toHaveLength(0);
      expect(row.payload).toEqual({
        isOccupationalRelevant: true,
        technicalType: PcmsoEsocialProcedureTypeEnum.AUDIOMETRY,
        status: PcmsoEsocialProcedureStatusEnum.ACTIVE,
        internalNotes: 'obs',
      });
    });

    it('exige procedureCode', () => {
      const row = parseCurationRow({ procedureCode: '' }, 5);
      expect(row.payload).toBeNull();
      expect(row.errors.some((e) => e.field === 'procedureCode')).toBe(true);
    });

    it('acumula erros de enum/boolean', () => {
      const row = parseCurationRow(
        {
          procedureCode: '0001',
          isOccupationalRelevant: 'x',
          technicalType: 'Y',
          status: 'Z',
        },
        3,
      );
      expect(row.payload).toBeNull();
      expect(row.errors.map((e) => e.field).sort()).toEqual([
        'isOccupationalRelevant',
        'status',
        'technicalType',
      ]);
    });

    it('notes vazio vira null', () => {
      const row = parseCurationRow(
        { procedureCode: '0001', internalNotes: '   ' },
        2,
      );
      expect(row.payload?.internalNotes).toBeNull();
    });
  });

  describe('isRawCurationEmpty', () => {
    it('true quando todos os campos editáveis estão vazios', () => {
      expect(
        isRawCurationEmpty({
          procedureCode: '0001',
          isOccupationalRelevant: '',
          technicalType: null,
          status: undefined,
          internalNotes: '  ',
        }),
      ).toBe(true);
    });

    it('false quando qualquer campo editável está preenchido', () => {
      expect(
        isRawCurationEmpty({
          procedureCode: '0001',
          isOccupationalRelevant: 'false',
        }),
      ).toBe(false);
      expect(
        isRawCurationEmpty({
          procedureCode: '0001',
          technicalType: 'TOXICOLOGICAL',
        }),
      ).toBe(false);
      expect(
        isRawCurationEmpty({ procedureCode: '0001', status: 'DRAFT' }),
      ).toBe(false);
      expect(
        isRawCurationEmpty({ procedureCode: '0001', internalNotes: 'obs' }),
      ).toBe(false);
    });
  });

  describe('describeCurationPayload', () => {
    it('lista todos os campos que serão gravados em um CREATE', () => {
      const changes = describeCurationPayload({
        isOccupationalRelevant: true,
        technicalType: PcmsoEsocialProcedureTypeEnum.TOXICOLOGICAL,
        status: PcmsoEsocialProcedureStatusEnum.ACTIVE,
        internalNotes: 'obs',
      });
      expect(changes).toHaveLength(4);
      expect(changes.find((c) => c.field === 'isOccupationalRelevant')?.to).toBe(
        'true',
      );
      expect(changes.find((c) => c.field === 'technicalType')?.to).toBe(
        'TOXICOLOGICAL',
      );
      expect(changes.every((c) => c.from === '—')).toBe(true);
    });
  });

  describe('diffCurationPayload', () => {
    const base = {
      isOccupationalRelevant: false,
      technicalType: null,
      status: PcmsoEsocialProcedureStatusEnum.DRAFT,
      internalNotes: null,
    };

    it('sem mudança retorna vazio', () => {
      expect(
        diffCurationPayload(base, {
          isOccupationalRelevant: false,
          technicalType: null,
          status: PcmsoEsocialProcedureStatusEnum.DRAFT,
          internalNotes: null,
        }),
      ).toHaveLength(0);
    });

    it('detecta campos alterados', () => {
      const changes = diffCurationPayload(base, {
        isOccupationalRelevant: true,
        technicalType: PcmsoEsocialProcedureTypeEnum.CLINICAL,
        status: PcmsoEsocialProcedureStatusEnum.ACTIVE,
        internalNotes: 'nova',
      });
      expect(changes.map((c) => c.field).sort()).toEqual([
        'internalNotes',
        'isOccupationalRelevant',
        'status',
        'technicalType',
      ]);
    });
  });
});
