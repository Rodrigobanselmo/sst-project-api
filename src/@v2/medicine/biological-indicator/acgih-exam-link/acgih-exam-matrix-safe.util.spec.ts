import { describe, expect, it } from '@jest/globals';

import {
  isAcgihDeterminantMatrixSafeMatch,
  matrixEvidenceInExam,
} from './acgih-exam-matrix-safe.util';

describe('matrixEvidenceInExam', () => {
  it('reconhece urina embutida no nome', () => {
    expect(
      matrixEvidenceInExam('urina', '1,6 hexametilenodiamina na urina', null),
    ).toBe(true);
  });

  it('reconhece sangue embutido no nome', () => {
    expect(matrixEvidenceInExam('sangue', 'Chumbo no sangue', null)).toBe(true);
  });

  it('reconhece soro/plasma', () => {
    expect(
      matrixEvidenceInExam('soro', 'Cobre no soro ou plasma', null),
    ).toBe(true);
  });

  it('reconhece ar exalado', () => {
    expect(
      matrixEvidenceInExam('ar exalado', 'Benzeno no ar exalado', null),
    ).toBe(true);
  });
});

describe('isAcgihDeterminantMatrixSafeMatch', () => {
  it('confirma determinante + matriz urina embutida no exame', () => {
    const result = isAcgihDeterminantMatrixSafeMatch({
      determinant: '1,6-hexametilenodiamina',
      matrix: 'urina',
      examName: '1,6 hexametilenodiamina na urina',
      examMaterial: 'urina',
    });
    expect(result.safe).toBe(true);
  });

  it('confirma ácido com sufixo (H) e matriz na urina', () => {
    const result = isAcgihDeterminantMatrixSafeMatch({
      determinant: 'Ácido butoxiacético (BAA)',
      matrix: 'urina',
      examName: 'Ácido butoxiacético na urina (BAA) (H)',
      examMaterial: 'urina',
    });
    expect(result.safe).toBe(true);
  });

  it('confirma chumbo no sangue', () => {
    const result = isAcgihDeterminantMatrixSafeMatch({
      determinant: 'Chumbo',
      matrix: 'sangue',
      examName: 'Chumbo no sangue',
      examMaterial: 'sangue',
    });
    expect(result.safe).toBe(true);
  });

  it('confirma TTCA abreviado na urina', () => {
    const result = isAcgihDeterminantMatrixSafeMatch({
      determinant: 'Ácido 2-tioxotiazolidina 4 carboxílico (TTCA)',
      matrix: 'urina',
      examName: 'TTCA na urina',
      examMaterial: 'urina',
    });
    expect(result.safe).toBe(true);
  });

  it('rejeita determinante fraco sem matriz compatível', () => {
    const result = isAcgihDeterminantMatrixSafeMatch({
      determinant: 'Substância inexistente xyz',
      matrix: 'urina',
      examName: 'Ácido hipúrico na urina',
      examMaterial: 'urina',
    });
    expect(result.safe).toBe(false);
    expect(result.reason).toBe('WEAK_DETERMINANT_MATCH');
  });

  it('rejeita matriz incompatível', () => {
    const result = isAcgihDeterminantMatrixSafeMatch({
      determinant: 'Chumbo',
      matrix: 'sangue',
      examName: 'Chumbo na urina',
      examMaterial: 'urina',
    });
    expect(result.safe).toBe(false);
  });
});
