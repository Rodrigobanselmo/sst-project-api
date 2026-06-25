import { describe, expect, it } from '@jest/globals';

import {
  parsePreviewRow,
  parseSheetBoolean,
} from './biological-indicator-preview.util';

const NORMATIVE_VERSION = 'NR-07-2022';

const baseRow = () => ({
  indicatorId: '',
  idempotencyKey: '',
  statusAtual: '',
  Substância: 'Benzeno',
  CAS: '71-43-2',
  Quadro: 'Quadro 1',
  'Tipo indicador': 'IBE/EE',
  'Indicador biológico (original)': 'Ácido S-fenilmercaptúrico',
  'Material biológico / matriz': 'Urina',
  'Momento da coleta': 'FJ',
  Valor: '0,5',
  Unidade: 'mg/g',
  'Observações NR-07': 'NE',
  requiresNormativeReview: 'false',
});

describe('parseSheetBoolean', () => {
  it('reconhece valores verdadeiros e falsos', () => {
    expect(parseSheetBoolean('true')).toEqual({ value: true, valid: true });
    expect(parseSheetBoolean('Sim')).toEqual({ value: true, valid: true });
    expect(parseSheetBoolean('false')).toEqual({ value: false, valid: true });
    expect(parseSheetBoolean('não')).toEqual({ value: false, valid: true });
  });

  it('marca valores não booleanos como inválidos', () => {
    expect(parseSheetBoolean('talvez').valid).toBe(false);
  });
});

describe('parsePreviewRow', () => {
  it('processa linha válida sem erros e expõe âncoras', () => {
    const result = parsePreviewRow(
      { ...baseRow(), indicatorId: 'ind-1', idempotencyKey: 'key-1' },
      2,
      NORMATIVE_VERSION,
    );

    expect(result.errors).toHaveLength(0);
    expect(result.payload).not.toBeNull();
    expect(result.indicatorId).toBe('ind-1');
    expect(result.idempotencyKey).toBe('key-1');
    expect(result.payload?.substanceName).toBe('Benzeno');
  });

  it('acumula erro quando falta substância', () => {
    const row = baseRow();
    row.Substância = '';
    const result = parsePreviewRow(row, 3, NORMATIVE_VERSION);

    expect(result.payload).toBeNull();
    expect(result.errors.some((e) => e.field === 'Substância')).toBe(true);
  });

  it('captura momento da coleta inválido', () => {
    const row = baseRow();
    row['Momento da coleta'] = 'XYZ';
    const result = parsePreviewRow(row, 4, NORMATIVE_VERSION);

    expect(result.payload).toBeNull();
    expect(
      result.errors.some((e) => e.field === 'Momento da coleta'),
    ).toBe(true);
  });

  it('captura booleano inválido em requiresNormativeReview', () => {
    const row = baseRow();
    row.requiresNormativeReview = 'maybe';
    const result = parsePreviewRow(row, 5, NORMATIVE_VERSION);

    expect(
      result.errors.some((e) => e.field === 'requiresNormativeReview'),
    ).toBe(true);
  });

  it('não para no primeiro erro (acumula múltiplos)', () => {
    const row = baseRow();
    row.Substância = '';
    row['Material biológico / matriz'] = '';
    const result = parsePreviewRow(row, 6, NORMATIVE_VERSION);

    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });
});
