import {
  BiologicalCollectionMomentEnum,
  BiologicalIndicatorDataOriginEnum,
  BiologicalIndicatorStatusEnum,
  BiologicalNormativeSourceEnum,
} from '@prisma/client';

import {
  ComparisonResult,
  normalizeCas,
  normalizeText,
} from '../../acgih-bei-comparison/acgih-bei-comparison.util';
import {
  ACGIH_PROMOTION_DEFAULT_APPLICABILITY,
  AcgihSourceEnrichment,
  MappedCollectionMoment,
} from './acgih-official-indicator-preview.util';

/**
 * 4P.1B — payload proposto (PREVIEW-ONLY) de um indicador oficial ACGIH/BEI.
 * NUNCA é persistido nesta fase. Reflete o que a fase 4P.2 (apply) criaria como
 * DRAFT, com proveniência e revisão normativa pendente.
 */
export type ProposedOfficialIndicatorPayload = {
  normativeSource: BiologicalNormativeSourceEnum;
  dataOrigin: BiologicalIndicatorDataOriginEnum;
  acgihBeiIndicatorId: string;
  substanceName: string;
  substanceNameNormalized: string;
  casPrimary: string | null;
  casNumbers: string[];
  biologicalIndicatorOriginal: string;
  biologicalIndicatorNormalized: string;
  biologicalMatrix: string | null;
  collectionMoment: BiologicalCollectionMomentEnum | null;
  referenceValue: string | null;
  referenceValueRaw: string | null;
  unit: string | null;
  normativeVersion: string | null;
  sourcePage: string | null;
  status: BiologicalIndicatorStatusEnum;
  requiresNormativeReview: boolean;
  occupationalApplicability: typeof ACGIH_PROMOTION_DEFAULT_APPLICABILITY;
  idempotencyKey: string;
};

const buildCasNumbers = (cas: string | null): string[] => {
  const normalized = normalizeCas(cas);
  return normalized ? [normalized] : [];
};

/**
 * Monta o payload proposto a partir da linha da comparação + enriquecimento da
 * base ACGIH/BEI + momento de coleta já mapeado. Não inventa valores: campos
 * ausentes permanecem null. `idempotencyKey` = acgih-bei::{acgihBeiIndicatorId}.
 */
export const buildProposedOfficialPayload = (params: {
  row: ComparisonResult;
  enrichment: AcgihSourceEnrichment | null;
  mappedMoment: MappedCollectionMoment;
}): ProposedOfficialIndicatorPayload => {
  const { row, enrichment, mappedMoment } = params;

  const year = enrichment?.referenceYear ?? enrichment?.sourceYear ?? row.acgihBeiSourceYear ?? null;
  const casPrimary = normalizeCas(row.cas) || null;

  return {
    normativeSource: BiologicalNormativeSourceEnum.ACGIH_BEI,
    dataOrigin: BiologicalIndicatorDataOriginEnum.ACGIH_BEI_COMPARISON,
    acgihBeiIndicatorId: row.acgihBeiId,
    substanceName: row.substanceName,
    substanceNameNormalized:
      enrichment?.substanceNameNormalized?.trim() ||
      normalizeText(row.substanceName),
    casPrimary,
    casNumbers: buildCasNumbers(row.cas),
    biologicalIndicatorOriginal: row.determinant ?? '',
    biologicalIndicatorNormalized: normalizeText(row.determinant),
    biologicalMatrix: row.biologicalMatrix ?? null,
    collectionMoment: mappedMoment.mappedValue,
    referenceValue: row.beiValue ?? null,
    referenceValueRaw: row.beiValue ?? null,
    unit: row.unit ?? null,
    normativeVersion: year ? `ACGIH-${year}` : null,
    sourcePage: enrichment?.sourcePage ?? row.acgihBeiSourcePage ?? null,
    status: BiologicalIndicatorStatusEnum.DRAFT,
    requiresNormativeReview: true,
    occupationalApplicability: ACGIH_PROMOTION_DEFAULT_APPLICABILITY,
    idempotencyKey: `acgih-bei::${row.acgihBeiId}`,
  };
};
