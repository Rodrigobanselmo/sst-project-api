import {
  materialsAreCompatible,
  scoreNameCompatibility,
} from '../biological-indicator-exam-provision.util';
import { normalizeText } from '../biological-indicator-normalize.util';
import { AcgihExamCatalogEntry } from './acgih-exam-link.util';

export const ACGIH_EXAM_PARTIAL_SCORE_THRESHOLD = 7;

export type AcgihMatrixSafeReason =
  | 'DETERMINANT_MATRIX_SAFE'
  | 'MATRIX_NOT_COMPATIBLE'
  | 'WEAK_DETERMINANT_MATCH'
  | 'AMBIGUOUS_CANDIDATES'
  | 'AMBIGUOUS_EXAM_MATCH'
  | 'EXAM_INACTIVE'
  | 'ALREADY_CONFIRMED'
  | 'LINKED_EXAM_MISMATCH'
  | 'NO_PENDING_LINK'
  | 'MULTIPLE_PENDING_LINKS'
  | 'NOT_PENDING';

export type AcgihMatrixSafeEvaluation = {
  safe: boolean;
  reason: AcgihMatrixSafeReason;
};

/** Sinais textuais de matriz/coleta embutidos no nome ou material do exame. */
export const matrixSignalsForIndicator = (matrix: string): string[] => {
  const norm = normalizeText(matrix);
  const signals: string[] = [];

  if (norm.includes('urina')) {
    signals.push('urina', 'urinario', 'urinaria', 'na urina', 'em urina');
  }
  if (norm.includes('sangue')) {
    signals.push(
      'sangue',
      'sanguineo',
      'sanguinea',
      'no sangue',
      'em sangue',
      'hemoglobina',
    );
  }
  if (norm.includes('soro') || norm.includes('plasma')) {
    signals.push(
      'soro',
      'plasma',
      'soro ou plasma',
      'soro/plasma',
      'no soro',
      'no plasma',
    );
  }
  if (norm.includes('exalado')) {
    signals.push('ar exalado', 'exalado', 'no ar exalado');
  }
  if (norm.includes('fezes') || norm.includes('fecal')) {
    signals.push('fezes', 'fecal', 'nas fezes');
  }

  if (!signals.length && norm) signals.push(norm);
  return signals;
};

/**
 * Verifica se a matriz/coleta ACGIH aparece no nome ou material do exame
 * operacional (ex.: determinante separado + matriz `urina` ↔ exame “na urina”).
 */
export const matrixEvidenceInExam = (
  matrix: string,
  examName: string,
  examMaterial: string | null | undefined,
): boolean => {
  const signals = matrixSignalsForIndicator(matrix).map(normalizeText);
  const nameNorm = normalizeText(examName);
  const materialNorm = normalizeText(examMaterial ?? '');
  const combined = `${nameNorm} ${materialNorm}`.trim();

  return signals.some((sig) => sig.length >= 3 && combined.includes(sig));
};

/**
 * Match seguro quando o determinante ACGIH casa de forma forte com o exame e a
 * matriz/coleta está embutida no nome/material (ou é compatível via material).
 */
export const isAcgihDeterminantMatrixSafeMatch = (params: {
  determinant: string;
  matrix: string;
  examName: string;
  examMaterial: string | null | undefined;
}): AcgihMatrixSafeEvaluation => {
  const { determinant, matrix, examName, examMaterial } = params;

  const matrixOk =
    matrixEvidenceInExam(matrix, examName, examMaterial) ||
    materialsAreCompatible(examMaterial ?? null, matrix);

  if (!matrixOk) {
    return { safe: false, reason: 'MATRIX_NOT_COMPATIBLE' };
  }

  const score = scoreNameCompatibility(determinant, examName);
  if (score < ACGIH_EXAM_PARTIAL_SCORE_THRESHOLD) {
    return { safe: false, reason: 'WEAK_DETERMINANT_MATCH' };
  }

  return { safe: true, reason: 'DETERMINANT_MATRIX_SAFE' };
};

/** Conta candidatos sistêmicos com score forte para o determinante + matriz. */
export const countAcgihExamStrongCandidates = (
  determinant: string,
  matrix: string,
  catalog: AcgihExamCatalogEntry[],
): number => {
  const ids = catalog
    .filter((exam) => {
      const score = scoreNameCompatibility(determinant, exam.name);
      if (score < ACGIH_EXAM_PARTIAL_SCORE_THRESHOLD) return false;
      return (
        matrixEvidenceInExam(matrix, exam.name, exam.material) ||
        materialsAreCompatible(exam.material, matrix)
      );
    })
    .map((exam) => exam.id);

  return new Set(ids).size;
};
