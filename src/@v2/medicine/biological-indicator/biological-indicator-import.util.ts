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

export const toIndicatorNormativePayload = (
  source:
    | IndicatorNormativePayload
    | Pick<
        OccupationalBiologicalIndicator,
        keyof IndicatorNormativePayload
      >,
): IndicatorNormativePayload => ({
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
});

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
