import { BiologicalIndicatorStatusEnum } from '@prisma/client';

import { IndicatorNormativePayload } from './biological-indicator-import.util';
import {
  parseSpreadsheetIndicatorRow,
  SpreadsheetIndicatorRow,
} from './biological-indicator-spreadsheet.parser';
import {
  BIOLOGICAL_INDICATOR_COLUMNS as COL,
  BIOLOGICAL_INDICATOR_REFERENCE_VALUES,
} from './biological-indicator-spreadsheet.constants';

export enum BiologicalIndicatorPreviewClassification {
  UNCHANGED = 'UNCHANGED',
  NEW = 'NEW',
  UPDATED = 'UPDATED',
  DEPRECATED_CANDIDATE = 'DEPRECATED_CANDIDATE',
  INVALID = 'INVALID',
  CONFLICT = 'CONFLICT',
}

export type PreviewAnchor = 'indicatorId' | 'idempotencyKey' | 'none';

export type PreviewRowError = {
  field: string;
  message: string;
};

export type ParsedPreviewRow = {
  rowNumber: number;
  indicatorId: string | null;
  idempotencyKey: string | null;
  statusInSheet: string | null;
  substanceName: string;
  /** Normative payload when the row is structurally valid; null when invalid. */
  payload: IndicatorNormativePayload | null;
  errors: PreviewRowError[];
};

const readCell = (row: SpreadsheetIndicatorRow, key: string): string =>
  String(row[key] ?? '').trim();

const BOOLEAN_TRUE = new Set(['true', '1', 'sim', 'yes', 'verdadeiro']);
const BOOLEAN_FALSE = new Set(['false', '0', 'nao', 'não', 'no', 'falso', '']);

export const parseSheetBoolean = (
  raw: string,
): { value: boolean | null; valid: boolean } => {
  const normalized = raw.trim().toLowerCase();
  if (BOOLEAN_TRUE.has(normalized)) return { value: true, valid: true };
  if (BOOLEAN_FALSE.has(normalized)) return { value: false, valid: true };
  return { value: null, valid: false };
};

/**
 * Parses a single preview row, reading anchor columns (indicatorId,
 * idempotencyKey, statusAtual) and building the normative payload while
 * accumulating per-row validation errors instead of throwing on the first one.
 */
export function parsePreviewRow(
  row: SpreadsheetIndicatorRow,
  rowNumber: number,
  normativeVersion: string,
): ParsedPreviewRow {
  const errors: PreviewRowError[] = [];

  const indicatorId = readCell(row, COL.indicatorId) || null;
  const idempotencyKey = readCell(row, COL.idempotencyKey) || null;
  const statusInSheet = readCell(row, COL.statusAtual) || null;
  const substanceName = readCell(row, COL.substanceName);

  // Required base fields
  if (!substanceName) {
    errors.push({ field: COL.substanceName, message: 'Substância é obrigatória.' });
  }
  if (!readCell(row, COL.biologicalIndicatorOriginal)) {
    errors.push({
      field: COL.biologicalIndicatorOriginal,
      message: 'Indicador biológico (original) é obrigatório.',
    });
  }
  if (!readCell(row, COL.biologicalMatrix)) {
    errors.push({
      field: COL.biologicalMatrix,
      message: 'Material biológico / matriz é obrigatório.',
    });
  }

  // Enum validations
  const quadro = readCell(row, COL.tableNumber);
  if (quadro && !/(1|2)/.test(quadro)) {
    errors.push({
      field: COL.tableNumber,
      message: `Quadro inválido: "${quadro}". Use ${BIOLOGICAL_INDICATOR_REFERENCE_VALUES.Quadro.join(' ou ')}.`,
    });
  }

  const tipo = readCell(row, COL.indicatorType).toUpperCase();
  if (tipo && !tipo.includes('IBE')) {
    errors.push({
      field: COL.indicatorType,
      message: `Tipo indicador inválido: "${tipo}". Use IBE/EE ou IBE/SC.`,
    });
  }

  const collectionMoment = readCell(row, COL.collectionMoment);
  const validMoments = BIOLOGICAL_INDICATOR_REFERENCE_VALUES['Momento da coleta'] as readonly string[];
  if (
    collectionMoment &&
    !validMoments.includes(
      collectionMoment.toUpperCase().replace(/\s+/g, '').replace('-', '_'),
    ) &&
    !validMoments.includes(collectionMoment.toUpperCase().replace(/\s+/g, ''))
  ) {
    errors.push({
      field: COL.collectionMoment,
      message: `Momento da coleta inválido: "${collectionMoment}".`,
    });
  }

  // Boolean validations (only when filled)
  const reviewRaw = readCell(row, COL.requiresNormativeReview);
  if (reviewRaw && !parseSheetBoolean(reviewRaw).valid) {
    errors.push({
      field: COL.requiresNormativeReview,
      message: `Valor booleano inválido: "${reviewRaw}". Use true ou false.`,
    });
  }
  const groupRaw = readCell(row, COL.isSubstanceGroup);
  if (groupRaw && !parseSheetBoolean(groupRaw).valid) {
    errors.push({
      field: COL.isSubstanceGroup,
      message: `Valor booleano inválido: "${groupRaw}". Use true ou false.`,
    });
  }

  // Status enum (when present)
  if (
    statusInSheet &&
    !Object.values(BiologicalIndicatorStatusEnum).includes(
      statusInSheet.toUpperCase() as BiologicalIndicatorStatusEnum,
    )
  ) {
    errors.push({
      field: COL.statusAtual,
      message: `Status inválido: "${statusInSheet}".`,
    });
  }

  // Build normative payload (reuses canonical parser). It may still throw on
  // edge cases not covered above; capture as a row error.
  let payload: IndicatorNormativePayload | null = null;
  try {
    const parsed = parseSpreadsheetIndicatorRow(row, normativeVersion);
    payload = {
      normativeSource: parsed.normativeSource,
      annex: parsed.annex,
      tableNumber: parsed.tableNumber,
      indicatorType: parsed.indicatorType,
      normativeVersion,
      substanceName: parsed.substanceName,
      substanceNameNormalized: parsed.substanceNameNormalized,
      casPrimary: parsed.casPrimary,
      casNumbers: parsed.casNumbers,
      substanceGroupId: null,
      isSubstanceGroup: parsed.isSubstanceGroup,
      biologicalIndicatorOriginal: parsed.biologicalIndicatorOriginal,
      biologicalIndicatorNormalized: parsed.biologicalIndicatorNormalized,
      biologicalMatrix: parsed.biologicalMatrix,
      collectionMoment: parsed.collectionMoment,
      referenceValue: parsed.referenceValue,
      referenceValueRaw: parsed.referenceValueRaw,
      unit: parsed.unit,
      technicalObservations: parsed.technicalObservations,
      technicalObservationsRaw: parsed.technicalObservationsRaw,
      defaultValidityMonths: parsed.defaultValidityMonths,
      collectionToleranceDays: parsed.collectionToleranceDays,
      occupationalApplicability: parsed.occupationalApplicability,
      requiresNormativeReview: parsed.requiresNormativeReview,
      generalApplicabilityNotes: parsed.generalApplicabilityNotes,
      status: parsed.status,
      dataOrigin: parsed.dataOrigin,
      idempotencyKey: parsed.idempotencyKey,
    };

    // Quadro 2 / IBE/SC coherence check (informative — flagged, not blocking)
    if (
      parsed.tableNumber === 'QUADRO_2' &&
      !parsed.requiresNormativeReview
    ) {
      errors.push({
        field: COL.requiresNormativeReview,
        message: 'Quadro 2 deve exigir revisão normativa/médica.',
      });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Erro desconhecido ao processar a linha.';
    errors.push({ field: '_row', message });
  }

  return {
    rowNumber,
    indicatorId,
    idempotencyKey,
    statusInSheet,
    substanceName,
    payload: errors.length ? null : payload,
    errors,
  };
}
