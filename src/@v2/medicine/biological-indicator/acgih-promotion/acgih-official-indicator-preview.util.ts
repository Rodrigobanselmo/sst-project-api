import {
  BiologicalCollectionMomentEnum,
  PcmsoAcgihBeiIndicatorConfidenceEnum,
} from '@prisma/client';

import {
  canonMatrix,
  canonMoment,
  ComparisonResult,
  normalizeCas,
  normalizeText,
} from '../../acgih-bei-comparison/acgih-bei-comparison.util';
import { ProposedOfficialIndicatorPayload } from './acgih-official-indicator-preview.mapper';

/** 4P.1B — origem da elegibilidade do candidato. */
export enum AcgihPromotionEligibilityTier {
  PRIMARY = 'PRIMARY',
  DIVERGENCE_DERIVED = 'DIVERGENCE_DERIVED',
}

/** 4P.1B — desfecho do candidato no preview (nenhuma escrita ocorre). */
export enum AcgihPromotionEligibilityStatus {
  ELIGIBLE = 'ELIGIBLE',
  BLOCKED = 'BLOCKED',
  WARNING = 'WARNING',
}

/** 4P.1B — risco de duplicidade detectado por chave normalizada. */
export enum AcgihPromotionDuplicateRisk {
  NONE = 'NONE',
  ALREADY_PROMOTED = 'ALREADY_PROMOTED',
  NEAR_DUPLICATE_NR7 = 'NEAR_DUPLICATE_NR7',
  NEAR_DUPLICATE_OFFICIAL = 'NEAR_DUPLICATE_OFFICIAL',
}

/** 4P.1B — confiança do mapeamento do momento de coleta para o enum NR-7. */
export enum AcgihPromotionMomentConfidence {
  SAFE = 'SAFE',
  AMBIGUOUS = 'AMBIGUOUS',
  UNMAPPED = 'UNMAPPED',
}

/** Códigos estáveis de bloqueio (para UI/telemetria; não criam dados). */
export const AcgihPromotionBlocker = {
  ALREADY_PROMOTED: 'ALREADY_PROMOTED',
  UNMAPPED_COLLECTION_MOMENT: 'UNMAPPED_COLLECTION_MOMENT',
  MISSING_SUBSTANCE: 'MISSING_SUBSTANCE',
  MISSING_DETERMINANT: 'MISSING_DETERMINANT',
  MISSING_MATRIX: 'MISSING_MATRIX',
  MISSING_VALUE: 'MISSING_VALUE',
  COMPLEMENTARY_REFERENCE_ACTIVE: 'COMPLEMENTARY_REFERENCE_ACTIVE',
  LOW_CONFIDENCE: 'LOW_CONFIDENCE',
} as const;

/**
 * 4P.1B — applicability default conservador para indicador oficial ACGIH/BEI.
 * Exige significância clínica e revisão médica; mantém apenas periódico ativo.
 * NÃO confunde com defaults da NR-7 (Quadro 1/2). Apenas proposta de preview.
 */
export const ACGIH_PROMOTION_DEFAULT_APPLICABILITY = {
  isPeriodic: true,
  isAdmission: false,
  isReturn: false,
  isChange: false,
  isDismissal: false,
  allowSeasonalAnnual: false,
  clinicalSignificance: true,
  requiresMedicalReview: true,
} as const;

/** Campos que o item ACGIH/BEI traz, além do que já existe na linha da comparação. */
export type AcgihSourceEnrichment = {
  notation: string | null;
  referenceYear: number | null;
  sourceYear: number | null;
  sourcePage: string | null;
  substanceNameNormalized: string | null;
};

export type MappedCollectionMoment = {
  original: string | null;
  mappedValue: BiologicalCollectionMomentEnum | null;
  confidence: AcgihPromotionMomentConfidence;
};

export type AcgihPromotionComparisonSnapshot = {
  comparisonStatus: string;
  operationalStatus: string | null;
  reviewDecision: string | null;
  reviewNote: string | null;
  hasComplementaryReference: boolean;
};

export type AcgihPromotionPreviewItem = {
  acgihBeiIndicatorId: string;
  substanceName: string;
  cas: string | null;
  determinant: string | null;
  biologicalMatrix: string | null;
  samplingTime: string | null;
  referenceValue: string | null;
  unit: string | null;
  notation: string | null;
  sourceYear: number | null;
  proposedNormativeVersion: string | null;
  sourcePage: string | null;
  eligibilityTier: AcgihPromotionEligibilityTier;
  eligibilityStatus: AcgihPromotionEligibilityStatus;
  eligibilityReason: string;
  blockers: string[];
  warnings: string[];
  duplicateRisk: AcgihPromotionDuplicateRisk;
  mappedFields: {
    collectionMoment: MappedCollectionMoment;
  };
  missingFields: string[];
  proposedOfficialPayload: ProposedOfficialIndicatorPayload;
  comparisonSnapshot: AcgihPromotionComparisonSnapshot;
};

const MOMENT_CODE_TO_ENUM: Record<string, BiologicalCollectionMomentEnum> = {
  AJ: BiologicalCollectionMomentEnum.AJ,
  FJ: BiologicalCollectionMomentEnum.FJ,
  FJFS: BiologicalCollectionMomentEnum.FJFS,
  AJFS: BiologicalCollectionMomentEnum.AJFS,
  AJ48: BiologicalCollectionMomentEnum.AJ48,
  NC: BiologicalCollectionMomentEnum.NC,
  FS: BiologicalCollectionMomentEnum.FS,
  'AJ-FJ': BiologicalCollectionMomentEnum.AJ_FJ,
  AJ_FJ: BiologicalCollectionMomentEnum.AJ_FJ,
};

// Buckets canônicos produzidos por canonMoment() → enum NR-7. Mapeamento
// determinístico e conservador; qualquer texto fora destes buckets fica UNMAPPED.
const MOMENT_BUCKET_TO_ENUM: Record<string, BiologicalCollectionMomentEnum> = {
  'antes jornada': BiologicalCollectionMomentEnum.AJ,
  'fim jornada': BiologicalCollectionMomentEnum.FJ,
  'fim jornada/fim semana': BiologicalCollectionMomentEnum.FJFS,
  'antes jornada/fim semana': BiologicalCollectionMomentEnum.AJFS,
  'antes jornada 48h': BiologicalCollectionMomentEnum.AJ48,
  'nao critico': BiologicalCollectionMomentEnum.NC,
  'fim semana': BiologicalCollectionMomentEnum.FS,
  'antes/fim jornada': BiologicalCollectionMomentEnum.AJ_FJ,
};

// 4P.2.1/4P.2.2 — frases livres ACGIH/BEI 2025 que canonMoment() (compartilhada
// com a comparação 4O) ainda NÃO reconhece, mas que têm equivalente claro no
// enum NR-7. Aplicado APENAS na promoção (não altera canonMoment nem o 4O).
// Chave já normalizada por normalizeText (minúsculas, sem acento). NÃO força
// mapeamentos ambíguos: só frases com correspondência inequívoca ao enum.
//  - "Antes da última jornada da semana" (ACGIH "Prior to last shift of
//    workweek") ⇒ AJFS (antes da jornada / fim de semana).
//  - "Final da exposição" (ACGIH "End of exposure") ⇒ FINAL_EXPOSURE (4P.2.2);
//    momento próprio, não confundir com "Final da jornada" (FJ).
const ACGIH_FREE_TEXT_MOMENT_TO_ENUM: Record<
  string,
  BiologicalCollectionMomentEnum
> = {
  'antes da ultima jornada da semana': BiologicalCollectionMomentEnum.AJFS,
  'antes da ultima jornada semanal': BiologicalCollectionMomentEnum.AJFS,
  'antes do ultimo turno da semana': BiologicalCollectionMomentEnum.AJFS,
  'prior to last shift of workweek': BiologicalCollectionMomentEnum.AJFS,
  'final da exposicao': BiologicalCollectionMomentEnum.FINAL_EXPOSURE,
  'fim da exposicao': BiologicalCollectionMomentEnum.FINAL_EXPOSURE,
  'final de exposicao': BiologicalCollectionMomentEnum.FINAL_EXPOSURE,
  'end of exposure': BiologicalCollectionMomentEnum.FINAL_EXPOSURE,
  // Fraseados "fim de jornada ao fim da semana" que canonMoment() não captura
  // (exige "fim/final de semana"); mantidos explicitamente como FJFS.
  'final da jornada e da semana': BiologicalCollectionMomentEnum.FJFS,
  'fim da jornada e da semana': BiologicalCollectionMomentEnum.FJFS,
  'final da jornada e fim da semana': BiologicalCollectionMomentEnum.FJFS,
};

/**
 * 4P.1B — mapeia o momento de coleta (texto livre ACGIH ou código NR-7) para o
 * enum BiologicalCollectionMomentEnum. Não inventa valores nem cria enum novo.
 * SAFE: código NR-7 exato ou bucket canônico reconhecido.
 * UNMAPPED: vazio ou texto não reconhecido (bloqueia criação futura).
 */
export const mapCollectionMoment = (
  raw?: string | null,
): MappedCollectionMoment => {
  const original = raw ?? null;
  const trimmed = (raw ?? '').trim();
  if (!trimmed) {
    return {
      original,
      mappedValue: null,
      confidence: AcgihPromotionMomentConfidence.UNMAPPED,
    };
  }

  const code = trimmed.toUpperCase().replace(/\s+/g, '');
  if (MOMENT_CODE_TO_ENUM[code]) {
    return {
      original,
      mappedValue: MOMENT_CODE_TO_ENUM[code],
      confidence: AcgihPromotionMomentConfidence.SAFE,
    };
  }

  // 4P.2.1 — frase livre ACGIH com equivalente inequívoco no enum NR-7, antes
  // de delegar para canonMoment (que é compartilhada com a comparação 4O).
  const freeText = ACGIH_FREE_TEXT_MOMENT_TO_ENUM[normalizeText(trimmed)];
  if (freeText) {
    return {
      original,
      mappedValue: freeText,
      confidence: AcgihPromotionMomentConfidence.SAFE,
    };
  }

  const bucket = canonMoment(trimmed);
  const mapped = MOMENT_BUCKET_TO_ENUM[bucket];
  if (mapped) {
    return {
      original,
      mappedValue: mapped,
      confidence: AcgihPromotionMomentConfidence.SAFE,
    };
  }

  return {
    original,
    mappedValue: null,
    confidence: AcgihPromotionMomentConfidence.UNMAPPED,
  };
};

/** Chave de duplicidade normalizada a partir de um candidato ACGIH (linha). */
export const buildCandidateDedupeKey = (
  row: ComparisonResult,
): string =>
  [
    normalizeCas(row.cas) || normalizeText(row.substanceName),
    normalizeText(row.determinant),
    canonMatrix(row.biologicalMatrix),
    canonMoment(row.samplingTime),
  ].join('::');

/** Chave de duplicidade normalizada a partir de um indicador oficial. */
export const buildOfficialDedupeKey = (official: {
  substanceNameNormalized: string | null;
  casPrimary: string | null;
  biologicalIndicatorNormalized: string | null;
  biologicalMatrix: string | null;
  collectionMoment: string | null;
}): string =>
  [
    normalizeCas(official.casPrimary) ||
      normalizeText(official.substanceNameNormalized),
    normalizeText(official.biologicalIndicatorNormalized),
    canonMatrix(official.biologicalMatrix),
    canonMoment(official.collectionMoment),
  ].join('::');

export type DedupeContext = {
  /** acgihBeiIndicatorId já promovidos (proveniência presente em oficial). */
  promotedAcgihIds: Set<string>;
  /** Chaves normalizadas de oficiais NR-7. */
  nr7Keys: Set<string>;
  /** Chaves normalizadas de oficiais ACGIH/BEI já existentes. */
  officialAcgihKeys: Set<string>;
};

const isComplementaryActive = (row: ComparisonResult): boolean => {
  if (!row.hasComplementaryReference) return false;
  const status = String(row.complementaryReferenceStatus ?? '').toUpperCase();
  return status === '' || status === 'ACTIVE';
};

/**
 * 4P.1B — avalia um candidato (já filtrado por inclusão) e devolve o item de
 * preview com bloqueios, avisos, duplicidade e payload proposto. Função pura.
 */
export const evaluateCandidate = (params: {
  row: ComparisonResult;
  tier: AcgihPromotionEligibilityTier;
  enrichment: AcgihSourceEnrichment | null;
  dedupe: DedupeContext;
  proposedOfficialPayload: ProposedOfficialIndicatorPayload;
  mappedMoment: MappedCollectionMoment;
}): AcgihPromotionPreviewItem => {
  const { row, tier, enrichment, dedupe, proposedOfficialPayload, mappedMoment } =
    params;

  const blockers: string[] = [];
  const warnings: string[] = [];
  const missingFields: string[] = [];

  // O enrichment traz apenas campos suplementares (notação, ano, página). Sua
  // ausência não bloqueia: os campos essenciais vêm da própria linha.

  // Campos essenciais (não inventar valores).
  if (!row.substanceName?.trim()) {
    blockers.push(AcgihPromotionBlocker.MISSING_SUBSTANCE);
    missingFields.push('substanceName');
  }
  if (!row.determinant?.trim()) {
    blockers.push(AcgihPromotionBlocker.MISSING_DETERMINANT);
    missingFields.push('determinant');
  }
  if (!row.biologicalMatrix?.trim()) {
    blockers.push(AcgihPromotionBlocker.MISSING_MATRIX);
    missingFields.push('biologicalMatrix');
  }
  if (!row.beiValue?.trim()) {
    blockers.push(AcgihPromotionBlocker.MISSING_VALUE);
    missingFields.push('referenceValue');
  }

  // Momento de coleta deve mapear com segurança para o enum NR-7.
  if (mappedMoment.confidence === AcgihPromotionMomentConfidence.UNMAPPED) {
    blockers.push(AcgihPromotionBlocker.UNMAPPED_COLLECTION_MOMENT);
    missingFields.push('collectionMoment');
  } else if (
    mappedMoment.confidence === AcgihPromotionMomentConfidence.AMBIGUOUS
  ) {
    warnings.push('Momento de coleta mapeado com ambiguidade; revisar.');
  }

  // Baixa confiança de transcrição bloqueia a promoção.
  if (row.confidence === PcmsoAcgihBeiIndicatorConfidenceEnum.LOW) {
    blockers.push(AcgihPromotionBlocker.LOW_CONFIDENCE);
  }

  // Fonte complementar ativa não deve virar indicador oficial.
  if (isComplementaryActive(row)) {
    blockers.push(AcgihPromotionBlocker.COMPLEMENTARY_REFERENCE_ACTIVE);
  }

  // Duplicidade.
  let duplicateRisk = AcgihPromotionDuplicateRisk.NONE;
  if (dedupe.promotedAcgihIds.has(row.acgihBeiId)) {
    duplicateRisk = AcgihPromotionDuplicateRisk.ALREADY_PROMOTED;
    blockers.push(AcgihPromotionBlocker.ALREADY_PROMOTED);
  } else {
    const key = buildCandidateDedupeKey(row);
    if (dedupe.nr7Keys.has(key)) {
      duplicateRisk = AcgihPromotionDuplicateRisk.NEAR_DUPLICATE_NR7;
      warnings.push(
        'Possível equivalente NR-7 por chave normalizada (revisar; não bloqueia).',
      );
    } else if (dedupe.officialAcgihKeys.has(key)) {
      duplicateRisk = AcgihPromotionDuplicateRisk.NEAR_DUPLICATE_OFFICIAL;
      warnings.push(
        'Possível indicador oficial ACGIH/BEI equivalente já existente (revisar).',
      );
    }
  }

  const eligibilityStatus = blockers.length
    ? AcgihPromotionEligibilityStatus.BLOCKED
    : warnings.length
      ? AcgihPromotionEligibilityStatus.WARNING
      : AcgihPromotionEligibilityStatus.ELIGIBLE;

  const eligibilityReason = buildEligibilityReason(
    tier,
    eligibilityStatus,
    blockers,
    warnings,
  );

  return {
    acgihBeiIndicatorId: row.acgihBeiId,
    substanceName: row.substanceName,
    cas: row.cas,
    determinant: row.determinant,
    biologicalMatrix: row.biologicalMatrix,
    samplingTime: row.samplingTime,
    referenceValue: row.beiValue,
    unit: row.unit,
    notation: enrichment?.notation ?? null,
    sourceYear: enrichment?.referenceYear ?? enrichment?.sourceYear ?? row.acgihBeiSourceYear ?? null,
    proposedNormativeVersion: proposedOfficialPayload.normativeVersion,
    sourcePage: enrichment?.sourcePage ?? row.acgihBeiSourcePage ?? null,
    eligibilityTier: tier,
    eligibilityStatus,
    eligibilityReason,
    blockers,
    warnings,
    duplicateRisk,
    mappedFields: { collectionMoment: mappedMoment },
    missingFields,
    proposedOfficialPayload,
    comparisonSnapshot: {
      comparisonStatus: String(row.comparisonStatus),
      operationalStatus: row.operationalStatus
        ? String(row.operationalStatus)
        : null,
      reviewDecision: row.review?.decision ?? null,
      reviewNote: row.review?.technicalNote ?? null,
      hasComplementaryReference: Boolean(row.hasComplementaryReference),
    },
  };
};

const buildEligibilityReason = (
  tier: AcgihPromotionEligibilityTier,
  status: AcgihPromotionEligibilityStatus,
  blockers: string[],
  warnings: string[],
): string => {
  const origin =
    tier === AcgihPromotionEligibilityTier.PRIMARY
      ? 'Candidato ACGIH confirmado sem correspondência (NO_MATCH_CONFIRMED).'
      : 'Candidato derivado de divergência técnica real (REAL_DIVERGENCE).';

  if (status === AcgihPromotionEligibilityStatus.BLOCKED) {
    return `${origin} Bloqueado: ${blockers.join(', ')}.`;
  }
  if (status === AcgihPromotionEligibilityStatus.WARNING) {
    return `${origin} Elegível com avisos: ${warnings.join(' ')}`;
  }
  return `${origin} Elegível para promoção (DRAFT) na fase de aplicação.`;
};
