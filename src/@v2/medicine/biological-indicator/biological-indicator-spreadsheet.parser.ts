import {
  BiologicalIndicatorDataOriginEnum,
  BiologicalIndicatorStatusEnum,
  BiologicalIndicatorTableEnum,
  BiologicalIndicatorTypeEnum,
  BiologicalNormativeSourceEnum,
} from '@prisma/client';

import {
  buildDefaultApplicability,
  parseOccupationalApplicability,
  resolveTableAndTypeFromSpreadsheet,
} from './biological-indicator-applicability.schema';
import { resolveNormativeSubstanceGroup } from './biological-indicator-groups.constant';
import {
  buildIdempotencyKey,
  normalizeReferenceValue,
  normalizeText,
  parseCasNumbers,
  parseCollectionMoment,
  parseTechnicalObservations,
  resolveCasPrimary,
} from './biological-indicator-normalize.util';

export type SpreadsheetIndicatorRow = Record<string, string | number | null | undefined>;

export type ParsedBiologicalIndicatorRow = {
  normativeSource: BiologicalNormativeSourceEnum;
  annex: ReturnType<typeof resolveTableAndTypeFromSpreadsheet>['annex'];
  tableNumber: BiologicalIndicatorTableEnum;
  indicatorType: BiologicalIndicatorTypeEnum;
  substanceName: string;
  substanceNameNormalized: string;
  casNumbers: string[];
  casPrimary: string | null;
  biologicalIndicatorOriginal: string;
  biologicalIndicatorNormalized: string;
  biologicalMatrix: string;
  collectionMoment: ReturnType<typeof parseCollectionMoment>;
  referenceValue: string | null;
  referenceValueRaw: string | null;
  unit: string | null;
  technicalObservations: ReturnType<typeof parseTechnicalObservations>;
  technicalObservationsRaw: string | null;
  defaultValidityMonths: number;
  collectionToleranceDays: number;
  occupationalApplicability: ReturnType<typeof parseOccupationalApplicability>;
  requiresNormativeReview: boolean;
  isSubstanceGroup: boolean;
  groupDefinition: ReturnType<typeof resolveNormativeSubstanceGroup>;
  generalApplicabilityNotes: string | null;
  status: BiologicalIndicatorStatusEnum;
  dataOrigin: BiologicalIndicatorDataOriginEnum;
  idempotencyKey: string;
};

export function parseSpreadsheetIndicatorRow(
  row: SpreadsheetIndicatorRow,
  normativeVersion: string,
): ParsedBiologicalIndicatorRow {
  const substanceName = String(row['Substância'] ?? '').trim();
  const quadro = String(row['Quadro'] ?? '').trim();
  const tipoIndicador = String(row['Tipo indicador'] ?? '').trim();

  if (!substanceName) {
    throw new Error('Linha sem substância');
  }

  const { annex, tableNumber, indicatorType } = resolveTableAndTypeFromSpreadsheet({
    quadro,
    tipoIndicador,
  });

  const substanceNameNormalized = normalizeText(substanceName);
  const biologicalIndicatorOriginal = String(
    row['Indicador biológico (original)'] ?? '',
  ).trim();
  const biologicalIndicatorNormalized = normalizeText(
    String(row['Indicador biológico (normalizado)'] ?? biologicalIndicatorOriginal),
  );
  const biologicalMatrix = String(row['Material biológico / matriz'] ?? '').trim();
  const biologicalMatrixNormalized = normalizeText(biologicalMatrix);

  if (!biologicalIndicatorOriginal || !biologicalMatrix) {
    throw new Error(`Linha incompleta para substância "${substanceName}"`);
  }

  const casNumbers = parseCasNumbers(String(row['CAS'] ?? ''));
  const collectionMoment = parseCollectionMoment(String(row['Momento da coleta'] ?? ''));
  const referenceValueRaw = String(row['Valor'] ?? '').trim() || null;
  const referenceValue = normalizeReferenceValue(referenceValueRaw);
  const unitRaw = String(row['Unidade'] ?? '').trim();
  const unit = unitRaw && unitRaw !== '-' ? unitRaw : null;
  const technicalObservationsRaw = String(row['Observações NR-07'] ?? '').trim() || null;
  const technicalObservations = parseTechnicalObservations(technicalObservationsRaw);
  const generalApplicabilityNotes =
    String(row['Regra geral / aplicabilidade'] ?? '').trim() ||
    String(row['Notas técnicas'] ?? '').trim() ||
    null;

  const groupDefinition = resolveNormativeSubstanceGroup(substanceName);
  const isSubstanceGroup = groupDefinition !== null;
  const isQuadro2 =
    tableNumber === BiologicalIndicatorTableEnum.QUADRO_2 ||
    indicatorType === BiologicalIndicatorTypeEnum.IBE_SC;

  const occupationalApplicability = parseOccupationalApplicability(
    buildDefaultApplicability({ tableNumber, indicatorType }),
  );

  const requiresNormativeReview = isQuadro2 || isSubstanceGroup;

  const idempotencyKey = buildIdempotencyKey({
    normativeSource: BiologicalNormativeSourceEnum.NR_07,
    normativeVersion,
    annex,
    tableNumber,
    substanceNameNormalized,
    casNumbers,
    biologicalIndicatorNormalized,
    biologicalMatrixNormalized,
    collectionMoment,
  });

  return {
    normativeSource: BiologicalNormativeSourceEnum.NR_07,
    annex,
    tableNumber,
    indicatorType,
    substanceName,
    substanceNameNormalized,
    casNumbers,
    casPrimary: resolveCasPrimary(casNumbers),
    biologicalIndicatorOriginal,
    biologicalIndicatorNormalized,
    biologicalMatrix,
    collectionMoment,
    referenceValue,
    referenceValueRaw,
    unit,
    technicalObservations,
    technicalObservationsRaw,
    defaultValidityMonths: 6,
    collectionToleranceDays: 45,
    occupationalApplicability,
    requiresNormativeReview,
    isSubstanceGroup,
    groupDefinition,
    generalApplicabilityNotes,
    status: BiologicalIndicatorStatusEnum.DRAFT,
    dataOrigin: BiologicalIndicatorDataOriginEnum.SPREADSHEET_IMPORT,
    idempotencyKey,
  };
}
