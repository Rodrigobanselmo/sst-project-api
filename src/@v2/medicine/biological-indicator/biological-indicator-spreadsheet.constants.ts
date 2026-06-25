import {
  BiologicalCollectionMomentEnum,
  BiologicalIndicatorStatusEnum,
  BiologicalIndicatorTableEnum,
  BiologicalIndicatorTechnicalObservationEnum,
  BiologicalIndicatorTypeEnum,
} from '@prisma/client';

export const BIOLOGICAL_INDICATOR_SHEET_NAMES = {
  DATA: 'Indicadores_NR07_AnexoI',
  INSTRUCTIONS: 'Instruções',
  REFERENCES: 'Referências',
} as const;

/**
 * Single source of truth for the spreadsheet column headers.
 * Kept aligned with biological-indicator-spreadsheet.parser.ts so export and
 * import-preview stay consistent.
 */
export const BIOLOGICAL_INDICATOR_COLUMNS = {
  indicatorId: 'indicatorId',
  idempotencyKey: 'idempotencyKey',
  normativeSource: 'normativeSource',
  normativeVersion: 'normativeVersion',
  annex: 'annex',
  statusAtual: 'statusAtual',
  substanceName: 'Substância',
  cas: 'CAS',
  isSubstanceGroup: 'isSubstanceGroup',
  substanceGroupType: 'substanceGroupType',
  tableNumber: 'Quadro',
  indicatorType: 'Tipo indicador',
  biologicalIndicatorOriginal: 'Indicador biológico (original)',
  biologicalIndicatorNormalized: 'Indicador biológico (normalizado)',
  biologicalMatrix: 'Material biológico / matriz',
  collectionMoment: 'Momento da coleta',
  referenceValue: 'Valor',
  unit: 'Unidade',
  technicalObservations: 'Observações NR-07',
  generalApplicabilityNotes: 'Regra geral / aplicabilidade',
  technicalNotes: 'Notas técnicas',
  defaultValidityMonths: 'defaultValidityMonths',
  collectionToleranceDays: 'collectionToleranceDays',
  requiresNormativeReview: 'requiresNormativeReview',
  // Curadoria (informativa — não usada no diff normativo)
  linkedRisks: 'Risco(s) vinculado(s)',
  confirmedRisks: 'Risco(s) confirmado(s)',
  primaryRisk: 'Risco principal',
  linkedExams: 'Exame(s) vinculado(s)',
  confirmedExams: 'Exame(s) confirmado(s)',
  defaultExam: 'Exame padrão',
  reviewNotes: 'reviewNotes',
  reviewedAt: 'reviewedAt',
  reviewedBy: 'reviewedBy',
} as const;

export type BiologicalIndicatorColumnKey =
  keyof typeof BIOLOGICAL_INDICATOR_COLUMNS;

/** Ordered headers for the data sheet (export + template). */
export const BIOLOGICAL_INDICATOR_COLUMN_ORDER: BiologicalIndicatorColumnKey[] = [
  'indicatorId',
  'idempotencyKey',
  'normativeSource',
  'normativeVersion',
  'annex',
  'statusAtual',
  'substanceName',
  'cas',
  'isSubstanceGroup',
  'substanceGroupType',
  'tableNumber',
  'indicatorType',
  'biologicalIndicatorOriginal',
  'biologicalIndicatorNormalized',
  'biologicalMatrix',
  'collectionMoment',
  'referenceValue',
  'unit',
  'technicalObservations',
  'generalApplicabilityNotes',
  'technicalNotes',
  'defaultValidityMonths',
  'collectionToleranceDays',
  'requiresNormativeReview',
  'linkedRisks',
  'confirmedRisks',
  'primaryRisk',
  'linkedExams',
  'confirmedExams',
  'defaultExam',
  'reviewNotes',
  'reviewedAt',
  'reviewedBy',
];

export const BIOLOGICAL_INDICATOR_REFERENCE_VALUES = {
  Quadro: ['Quadro 1', 'Quadro 2'],
  'Tipo indicador': ['IBE/EE', 'IBE/SC'],
  'Momento da coleta': Object.values(BiologicalCollectionMomentEnum),
  'Observações NR-07': Object.values(BiologicalIndicatorTechnicalObservationEnum),
  status: Object.values(BiologicalIndicatorStatusEnum),
  Booleanos: ['true', 'false'],
} as const;

export const TABLE_LABEL_TO_ENUM: Record<string, BiologicalIndicatorTableEnum> = {
  'quadro 1': BiologicalIndicatorTableEnum.QUADRO_1,
  'quadro 2': BiologicalIndicatorTableEnum.QUADRO_2,
  quadro_1: BiologicalIndicatorTableEnum.QUADRO_1,
  quadro_2: BiologicalIndicatorTableEnum.QUADRO_2,
};

export const TABLE_ENUM_TO_LABEL: Record<BiologicalIndicatorTableEnum, string> = {
  [BiologicalIndicatorTableEnum.QUADRO_1]: 'Quadro 1',
  [BiologicalIndicatorTableEnum.QUADRO_2]: 'Quadro 2',
};

export const TYPE_ENUM_TO_LABEL: Record<BiologicalIndicatorTypeEnum, string> = {
  [BiologicalIndicatorTypeEnum.IBE_EE]: 'IBE/EE',
  [BiologicalIndicatorTypeEnum.IBE_SC]: 'IBE/SC',
};
