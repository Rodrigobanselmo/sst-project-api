import {
  BiologicalCollectionMomentEnum,
  BiologicalIndicatorAnnexEnum,
  BiologicalIndicatorDataOriginEnum,
  BiologicalIndicatorStatusEnum,
  BiologicalIndicatorTableEnum,
  BiologicalIndicatorTechnicalObservationEnum,
  BiologicalIndicatorTypeEnum,
  BiologicalNormativeSourceEnum,
  OccupationalBiologicalIndicator,
  Prisma,
} from '@prisma/client';

import { OccupationalApplicability, parseOccupationalApplicability } from './biological-indicator-applicability.schema';

export type IndicatorNormativePayload = {
  normativeSource: BiologicalNormativeSourceEnum;
  annex: BiologicalIndicatorAnnexEnum;
  tableNumber: BiologicalIndicatorTableEnum;
  indicatorType: BiologicalIndicatorTypeEnum;
  normativeVersion: string;
  substanceName: string;
  substanceNameNormalized: string;
  casPrimary: string | null;
  casNumbers: string[];
  substanceGroupId: string | null;
  isSubstanceGroup: boolean;
  biologicalIndicatorOriginal: string;
  biologicalIndicatorNormalized: string;
  biologicalMatrix: string;
  collectionMoment: BiologicalCollectionMomentEnum;
  referenceValue: string | null;
  referenceValueRaw: string | null;
  unit: string | null;
  technicalObservations: BiologicalIndicatorTechnicalObservationEnum[];
  technicalObservationsRaw: string | null;
  defaultValidityMonths: number;
  collectionToleranceDays: number;
  occupationalApplicability: OccupationalApplicability;
  requiresNormativeReview: boolean;
  generalApplicabilityNotes: string | null;
  status: BiologicalIndicatorStatusEnum;
  dataOrigin: BiologicalIndicatorDataOriginEnum;
  idempotencyKey: string;
};

const sortCasNumbers = (values: string[]) => [...values].sort();

const sortTechnicalObservations = (
  values: BiologicalIndicatorTechnicalObservationEnum[],
) => [...values].sort();

/**
 * 4P.1A — erro controlado para registros NR-07 sem os campos normativos
 * obrigatórios. Após tornar annex/tableNumber/indicatorType/normativeVersion
 * nullable no schema (para permitir ACGIH/BEI), a obrigatoriedade lógica da NR-07
 * é garantida em código.
 */
export class Nr07NormativeFieldsError extends Error {
  constructor(public readonly missingFields: string[]) {
    super(
      `Indicador NR-07 com campos normativos obrigatórios ausentes: ${missingFields.join(
        ', ',
      )}.`,
    );
    this.name = 'Nr07NormativeFieldsError';
  }
}

type Nr07NormativeRequiredFields = {
  annex: BiologicalIndicatorAnnexEnum;
  tableNumber: BiologicalIndicatorTableEnum;
  indicatorType: BiologicalIndicatorTypeEnum;
  normativeVersion: string;
};

/**
 * 4P.1A — guard que mantém a NR-07 logicamente obrigatória. Para
 * normativeSource = NR_07, exige annex, tableNumber, indicatorType e
 * normativeVersion; caso contrário lança {@link Nr07NormativeFieldsError}.
 * Registros não-NR-7 (ex.: futura origem ACGIH/BEI) passam sem exigência.
 */
export const assertNr07NormativeFields = <
  T extends {
    normativeSource: BiologicalNormativeSourceEnum;
    annex: BiologicalIndicatorAnnexEnum | null;
    tableNumber: BiologicalIndicatorTableEnum | null;
    indicatorType: BiologicalIndicatorTypeEnum | null;
    normativeVersion: string | null;
  },
>(
  source: T,
): T & Nr07NormativeRequiredFields => {
  if (source.normativeSource === BiologicalNormativeSourceEnum.NR_07) {
    const missing: string[] = [];
    if (source.annex == null) missing.push('annex');
    if (source.tableNumber == null) missing.push('tableNumber');
    if (source.indicatorType == null) missing.push('indicatorType');
    if (
      source.normativeVersion == null ||
      String(source.normativeVersion).trim() === ''
    ) {
      missing.push('normativeVersion');
    }
    if (missing.length) throw new Nr07NormativeFieldsError(missing);
  }
  return source as T & Nr07NormativeRequiredFields;
};

export const toIndicatorNormativePayload = (
  rawSource:
    | IndicatorNormativePayload
    | Pick<
        OccupationalBiologicalIndicator,
        keyof IndicatorNormativePayload
      >,
): IndicatorNormativePayload => {
  // 4P.1A — payload normativo é NR-07 por contrato; garante os campos exigidos
  // mesmo agora que são nullable no schema.
  const source = assertNr07NormativeFields(rawSource);
  return {
    normativeSource: source.normativeSource,
    annex: source.annex,
    tableNumber: source.tableNumber,
    indicatorType: source.indicatorType,
    normativeVersion: source.normativeVersion,
    substanceName: source.substanceName,
    substanceNameNormalized: source.substanceNameNormalized,
    casPrimary: source.casPrimary,
    casNumbers: sortCasNumbers(source.casNumbers ?? []),
    substanceGroupId: source.substanceGroupId,
    isSubstanceGroup: source.isSubstanceGroup,
    biologicalIndicatorOriginal: source.biologicalIndicatorOriginal,
    biologicalIndicatorNormalized: source.biologicalIndicatorNormalized,
    biologicalMatrix: source.biologicalMatrix,
    collectionMoment: source.collectionMoment,
    referenceValue: source.referenceValue,
    referenceValueRaw: source.referenceValueRaw,
    unit: source.unit,
    technicalObservations: sortTechnicalObservations(
      source.technicalObservations ?? [],
    ),
    technicalObservationsRaw: source.technicalObservationsRaw,
    defaultValidityMonths: source.defaultValidityMonths,
    collectionToleranceDays: source.collectionToleranceDays,
    occupationalApplicability: parseOccupationalApplicability(
      source.occupationalApplicability,
    ),
    requiresNormativeReview: source.requiresNormativeReview,
    generalApplicabilityNotes: source.generalApplicabilityNotes,
    status: source.status,
    dataOrigin: source.dataOrigin,
    idempotencyKey: source.idempotencyKey,
  };
};

export const serializeIndicatorNormativePayload = (
  payload: IndicatorNormativePayload,
): string => JSON.stringify(toIndicatorNormativePayload(payload));

export const getNormativePayloadDiffFields = (
  existing: Pick<OccupationalBiologicalIndicator, keyof IndicatorNormativePayload>,
  incoming: IndicatorNormativePayload,
): Array<keyof IndicatorNormativePayload> => {
  const left = toIndicatorNormativePayload(existing);
  const right = toIndicatorNormativePayload(incoming);

  return (Object.keys(left) as Array<keyof IndicatorNormativePayload>).filter(
    (field) => JSON.stringify(left[field]) !== JSON.stringify(right[field]),
  );
};

export const hasNormativeContentChanges = (
  existing: Pick<OccupationalBiologicalIndicator, keyof IndicatorNormativePayload>,
  incoming: IndicatorNormativePayload,
): boolean =>
  serializeIndicatorNormativePayload(toIndicatorNormativePayload(existing)) !==
  serializeIndicatorNormativePayload(incoming);

export const buildIndicatorCreateData = (
  payload: IndicatorNormativePayload,
  importBatchId: string | null,
): Prisma.OccupationalBiologicalIndicatorCreateInput => ({
  ...payload,
  occupationalApplicability: payload.occupationalApplicability,
  importBatch: importBatchId ? { connect: { id: importBatchId } } : undefined,
});

export const buildIndicatorUpdateData = (
  payload: IndicatorNormativePayload,
  importBatchId: string | null,
): Prisma.OccupationalBiologicalIndicatorUpdateInput => ({
  ...payload,
  occupationalApplicability: payload.occupationalApplicability,
  importBatch: importBatchId ? { connect: { id: importBatchId } } : undefined,
});
