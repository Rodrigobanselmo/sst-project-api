import {
  BiologicalIndicatorMatchConfidenceEnum,
  BiologicalIndicatorMatchMethodEnum,
} from '@prisma/client';

import {
  materialsAreCompatible,
  scoreNameCompatibility,
} from '../biological-indicator-exam-provision.util';
import { normalizeText } from '../biological-indicator-normalize.util';
import { isAcgihDeterminantMatrixSafeMatch } from './acgih-exam-matrix-safe.util';

/** Exame sistêmico candidato (catálogo SimpleSST). */
export type AcgihExamCatalogEntry = {
  id: number;
  name: string;
  material: string | null;
  esocial27Code: string | null;
};

/** Vínculo NR-7 → exame já confirmado, para reaproveitamento seguro. */
export type Nr7ExamLinkSnapshot = {
  determinantNormalized: string;
  matrix: string;
  examId: number;
  examName: string;
  examMaterial: string | null;
};

/** Indicador ACGIH/BEI oficial a vincular. */
export type AcgihIndicatorSnapshot = {
  id: string;
  substanceName: string;
  determinant: string;
  determinantNormalized: string;
  matrix: string;
};

export type AcgihExamCandidate = {
  examId: number;
  examName: string;
  confidence: string;
  reason: string;
};

export type AcgihExamMatch = {
  examId: number;
  examName: string;
  examMaterial: string | null;
  matchMethod: BiologicalIndicatorMatchMethodEnum;
  matchConfidence: BiologicalIndicatorMatchConfidenceEnum;
  /** Match seguro (NR-7 reuse ou nome exato) → isConfirmed=true/requiresReview=false. */
  safe: boolean;
  reusedFromNr7: boolean;
};

export type AcgihExamMatchOutcome =
  | { kind: 'matched'; match: AcgihExamMatch }
  | { kind: 'ambiguous'; candidates: AcgihExamCandidate[] }
  | { kind: 'none' };

const EXACT_SCORE = 10;
const PARTIAL_THRESHOLD = 7;

/**
 * Resolve o exame do catálogo sistêmico para um indicador ACGIH/BEI, em ordem
 * de prioridade e SEM criar exame (não inventa). Distingue match único seguro,
 * ambiguidade (vários candidatos) e ausência de candidato.
 *
 * Ordem:
 *  1) reaproveitamento NR-7: mesmo determinante normalizado + matriz compatível
 *     com um vínculo NR-7→exame já confirmado;
 *  2) nome/determinante no catálogo (exato e depois parcial), com matriz compatível.
 *
 * CAS/substância não são usados como critério único de exame (apoio apenas), pois
 * o exame mede o determinante biológico, não a substância-mãe.
 */
export const matchAcgihIndicatorExam = (params: {
  indicator: AcgihIndicatorSnapshot;
  catalog: AcgihExamCatalogEntry[];
  nr7ExamLinks: Nr7ExamLinkSnapshot[];
}): AcgihExamMatchOutcome => {
  const { indicator, catalog, nr7ExamLinks } = params;

  // 1) Reaproveitamento NR-7 por determinante normalizado + matriz compatível.
  const determinant = indicator.determinantNormalized?.trim();
  if (determinant) {
    const reuse = nr7ExamLinks.filter(
      (link) =>
        link.determinantNormalized === determinant &&
        materialsAreCompatible(link.examMaterial, indicator.matrix),
    );
    const distinctReuseIds = Array.from(new Set(reuse.map((r) => r.examId)));
    if (distinctReuseIds.length === 1) {
      const link = reuse.find((r) => r.examId === distinctReuseIds[0])!;
      return {
        kind: 'matched',
        match: {
          examId: link.examId,
          examName: link.examName,
          examMaterial: link.examMaterial,
          matchMethod: BiologicalIndicatorMatchMethodEnum.CATALOG_EQUIVALENCE,
          matchConfidence: BiologicalIndicatorMatchConfidenceEnum.HIGH,
          safe: true,
          reusedFromNr7: true,
        },
      };
    }
    if (distinctReuseIds.length > 1) {
      return {
        kind: 'ambiguous',
        candidates: distinctReuseIds.map((id) => {
          const link = reuse.find((r) => r.examId === id)!;
          return {
            examId: id,
            examName: link.examName,
            confidence: 'HIGH',
            reason: 'NR-7 reuse (múltiplos exames para o determinante)',
          };
        }),
      };
    }
  }

  // 2) Catálogo sistêmico por nome/determinante + matriz.
  const scored = catalog
    .map((exam) => ({
      exam,
      score: scoreNameCompatibility(indicator.determinant, exam.name),
      materialOk: materialsAreCompatible(exam.material, indicator.matrix),
    }))
    .filter((entry) => entry.score >= PARTIAL_THRESHOLD && entry.materialOk)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) return { kind: 'none' };

  const topScore = scored[0].score;
  const top = scored.filter((entry) => entry.score === topScore);

  // Empate no topo → ambíguo (lista candidatos).
  if (top.length > 1) {
    return {
      kind: 'ambiguous',
      candidates: top.map((entry) => ({
        examId: entry.exam.id,
        examName: entry.exam.name,
        confidence: topScore >= EXACT_SCORE ? 'HIGH' : 'PROBABLE',
        reason: `Score de nome ${entry.score} (matriz compatível)`,
      })),
    };
  }

  const best = scored[0];
  const isExact = best.score >= EXACT_SCORE;
  const matrixSafe = isAcgihDeterminantMatrixSafeMatch({
    determinant: indicator.determinant,
    matrix: indicator.matrix,
    examName: best.exam.name,
    examMaterial: best.exam.material,
  });
  const safe = isExact || matrixSafe.safe;
  return {
    kind: 'matched',
    match: {
      examId: best.exam.id,
      examName: best.exam.name,
      examMaterial: best.exam.material,
      matchMethod: safe
        ? BiologicalIndicatorMatchMethodEnum.NAME_EXACT
        : BiologicalIndicatorMatchMethodEnum.NAME_FUZZY,
      matchConfidence: safe
        ? BiologicalIndicatorMatchConfidenceEnum.HIGH
        : BiologicalIndicatorMatchConfidenceEnum.PROBABLE,
      safe,
      reusedFromNr7: false,
    },
  };
};

/** Normaliza determinante para casamento (reusa a normalização canônica). */
export const normalizeDeterminant = (value: string | null | undefined): string =>
  normalizeText(value ?? '');

/**
 * Nome sugerido para um exame sistêmico criado a partir do indicador ACGIH/BEI.
 * Simples e rastreável (determinante + matriz). Não inventa sufixos de catálogo
 * como (H)/(SH). Se o determinante já cita a matriz, usa-o tal como está.
 */
export const buildAcgihExamName = (
  determinant: string | null | undefined,
  matrix: string | null | undefined,
): string => {
  const det = (determinant ?? '').trim();
  const mat = (matrix ?? '').trim();
  if (!det) return '';
  if (!mat) return det;

  const detNorm = normalizeText(det);
  const matNorm = normalizeText(mat);
  if (matNorm && detNorm.includes(matNorm)) return det;

  if (matNorm.includes('urina')) return `${det} na urina`;
  if (matNorm.includes('sangue')) return `${det} no sangue`;
  if (matNorm.includes('exalado')) return `${det} no ar exalado`;
  return `${det} (${mat})`;
};

export type AcgihExamPreviewStatus =
  | 'LINKED'
  | 'LINKED_PENDING_CONFIRMATION'
  | 'NOT_LINKED'
  | 'AMBIGUOUS'
  | 'NO_MATCH'
  | 'READY_TO_CREATE';

export type AcgihExamPreviewResult = {
  status: AcgihExamPreviewStatus;
  examId?: number;
  examName?: string;
  candidates?: AcgihExamCandidate[];
  suggestedExamName?: string;
  reason?: string;
};

/**
 * Classifica o estado de exame de um indicador ACGIH/BEI para a tela de
 * curadoria (read-only). `LINKED` apenas quando o vínculo está confirmado
 * (mesmo critério do sync da Biblioteca). Vínculo ativo não confirmado vira
 * `LINKED_PENDING_CONFIRMATION`. Sem vínculo, deriva do matcher.
 */
export const classifyAcgihExamPreview = (params: {
  alreadyLinked: {
    examId: number;
    examName: string | null;
    isConfirmed: boolean;
    requiresReview?: boolean;
  } | null;
  indicator: AcgihIndicatorSnapshot;
  outcome: AcgihExamMatchOutcome;
}): AcgihExamPreviewResult => {
  const { alreadyLinked, indicator, outcome } = params;

  if (alreadyLinked) {
    if (!alreadyLinked.isConfirmed) {
      return {
        status: 'LINKED_PENDING_CONFIRMATION',
        examId: alreadyLinked.examId,
        examName: alreadyLinked.examName ?? undefined,
        reason:
          'Vínculo de exame aguarda confirmação manual antes do sync da Biblioteca.',
      };
    }

    return {
      status: 'LINKED',
      examId: alreadyLinked.examId,
      examName: alreadyLinked.examName ?? undefined,
    };
  }

  if (outcome.kind === 'matched') {
    return {
      status: 'NOT_LINKED',
      examId: outcome.match.examId,
      examName: outcome.match.examName,
    };
  }

  if (outcome.kind === 'ambiguous') {
    return { status: 'AMBIGUOUS', candidates: outcome.candidates };
  }

  const hasDeterminant = !!indicator.determinant?.trim();
  const hasMatrix = !!indicator.matrix?.trim();
  if (hasDeterminant && hasMatrix) {
    return {
      status: 'READY_TO_CREATE',
      suggestedExamName: buildAcgihExamName(
        indicator.determinant,
        indicator.matrix,
      ),
    };
  }

  return {
    status: 'NO_MATCH',
    reason: !hasDeterminant ? 'MISSING_DETERMINANT' : 'MISSING_MATRIX',
  };
};
