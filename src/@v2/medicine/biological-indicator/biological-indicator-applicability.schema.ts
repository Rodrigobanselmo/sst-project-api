import { z } from 'zod';

import {
  BiologicalIndicatorAnnexEnum,
  BiologicalIndicatorTableEnum,
  BiologicalIndicatorTypeEnum,
} from '@prisma/client';

export const OccupationalApplicabilityBaseSchema = z.object({
  isPeriodic: z.boolean(),
  isAdmission: z.boolean(),
  isReturn: z.boolean(),
  isChange: z.boolean(),
  isDismissal: z.boolean(),
  allowSeasonalAnnual: z.boolean(),
  clinicalSignificance: z.boolean(),
  requiresMedicalReview: z.boolean(),
});

export type OccupationalApplicability = z.infer<typeof OccupationalApplicabilityBaseSchema>;

export const QUADRO_1_APPLICABILITY_DEFAULT: OccupationalApplicability = {
  isPeriodic: true,
  isAdmission: false,
  isReturn: false,
  isChange: false,
  isDismissal: false,
  allowSeasonalAnnual: true,
  clinicalSignificance: false,
  requiresMedicalReview: false,
};

export const QUADRO_2_APPLICABILITY_DEFAULT: OccupationalApplicability = {
  isPeriodic: true,
  isAdmission: false,
  isReturn: false,
  isChange: false,
  isDismissal: false,
  allowSeasonalAnnual: false,
  clinicalSignificance: true,
  requiresMedicalReview: true,
};

export const OccupationalApplicabilitySchema = OccupationalApplicabilityBaseSchema;

export function buildDefaultApplicability(params: {
  tableNumber: BiologicalIndicatorTableEnum;
  indicatorType?: BiologicalIndicatorTypeEnum;
}): OccupationalApplicability {
  const isQuadro2 =
    params.tableNumber === BiologicalIndicatorTableEnum.QUADRO_2 ||
    params.indicatorType === BiologicalIndicatorTypeEnum.IBE_SC;

  return isQuadro2
    ? { ...QUADRO_2_APPLICABILITY_DEFAULT }
    : { ...QUADRO_1_APPLICABILITY_DEFAULT };
}

export function parseOccupationalApplicability(value: unknown): OccupationalApplicability {
  return OccupationalApplicabilitySchema.parse(value);
}

export function resolveTableAndTypeFromSpreadsheet(params: {
  quadro: string;
  tipoIndicador: string;
}): {
  tableNumber: BiologicalIndicatorTableEnum;
  indicatorType: BiologicalIndicatorTypeEnum;
  annex: BiologicalIndicatorAnnexEnum;
} {
  const quadro = params.quadro.trim().toLowerCase();
  const tipo = params.tipoIndicador.trim().toUpperCase();

  const tableNumber =
    quadro.includes('2') || tipo.includes('IBE/SC')
      ? BiologicalIndicatorTableEnum.QUADRO_2
      : BiologicalIndicatorTableEnum.QUADRO_1;

  const indicatorType =
    tableNumber === BiologicalIndicatorTableEnum.QUADRO_2 ||
    tipo.includes('IBE/SC')
      ? BiologicalIndicatorTypeEnum.IBE_SC
      : BiologicalIndicatorTypeEnum.IBE_EE;

  return {
    tableNumber,
    indicatorType,
    annex: BiologicalIndicatorAnnexEnum.ANNEX_I,
  };
}
