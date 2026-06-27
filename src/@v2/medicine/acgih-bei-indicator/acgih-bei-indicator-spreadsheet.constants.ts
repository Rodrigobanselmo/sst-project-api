import {
  PcmsoAcgihBeiIndicatorConfidenceEnum,
  PcmsoAcgihBeiIndicatorSourceEnum,
  PcmsoAcgihBeiIndicatorStatusEnum,
} from '@prisma/client';

/** Abas do workbook ACGIH/BEI. Aba de dados compatível com a planilha do usuário. */
export const ACGIH_BEI_SHEET_NAMES = {
  DATA: 'ACGIH_BEI_Curadoria',
  INSTRUCTIONS: 'Instruções',
  REFERENCES: 'Referências',
} as const;

/** Ordem das colunas (cabeçalho = nome técnico) para round-trip determinístico. */
export const ACGIH_BEI_COLUMN_ORDER = [
  'id', // read-only (âncora)
  'substanceName',
  'cas',
  'referenceYear',
  'determinant',
  'biologicalMatrix',
  'samplingTime',
  'beiValue',
  'unit',
  'notation',
  'status',
  'source',
  'sourceYear',
  'isCurated',
  'internalNotes',
  'sourcePage',
  'confidence',
] as const;

export type AcgihBeiColumnKey = (typeof ACGIH_BEI_COLUMN_ORDER)[number];

/** Colunas read-only: ignoradas na escrita; alteração vira aviso na prévia. */
export const ACGIH_BEI_READONLY_COLUMNS: AcgihBeiColumnKey[] = ['id'];

export const ACGIH_BEI_STATUSES = Object.values(
  PcmsoAcgihBeiIndicatorStatusEnum,
);
export const ACGIH_BEI_SOURCES = Object.values(
  PcmsoAcgihBeiIndicatorSourceEnum,
);
export const ACGIH_BEI_CONFIDENCES = Object.values(
  PcmsoAcgihBeiIndicatorConfidenceEnum,
);

export const ACGIH_BEI_BOOLEAN_TRUE_TOKENS = [
  'true',
  '1',
  'sim',
  's',
  'verdadeiro',
  'yes',
  'y',
];
export const ACGIH_BEI_BOOLEAN_FALSE_TOKENS = [
  'false',
  '0',
  'nao',
  'n',
  'falso',
  'no',
];

/** Aceita os rótulos PT da planilha além dos valores EN do enum. */
export const ACGIH_BEI_CONFIDENCE_TOKENS: Record<
  string,
  PcmsoAcgihBeiIndicatorConfidenceEnum
> = {
  high: PcmsoAcgihBeiIndicatorConfidenceEnum.HIGH,
  medium: PcmsoAcgihBeiIndicatorConfidenceEnum.MEDIUM,
  low: PcmsoAcgihBeiIndicatorConfidenceEnum.LOW,
  alta: PcmsoAcgihBeiIndicatorConfidenceEnum.HIGH,
  media: PcmsoAcgihBeiIndicatorConfidenceEnum.MEDIUM,
  baixa: PcmsoAcgihBeiIndicatorConfidenceEnum.LOW,
};

export const ACGIH_BEI_REFERENCE_VALUES: Record<string, string[]> = {
  status: [...ACGIH_BEI_STATUSES],
  source: [...ACGIH_BEI_SOURCES],
  confidence: [...ACGIH_BEI_CONFIDENCES, 'Alta', 'Média', 'Baixa', '(vazio)'],
  biologicalMatrix: [
    'urina',
    'sangue',
    'soro ou plasma',
    'ar exalado final',
    'texto livre',
  ],
  notation: ['B, Ne, Sq, Nq, Pop; podem aparecer combinadas (texto livre)'],
  isCurated: [...ACGIH_BEI_BOOLEAN_TRUE_TOKENS, ...ACGIH_BEI_BOOLEAN_FALSE_TOKENS],
};

export const ACGIH_BEI_COLUMN_WIDTHS: Partial<Record<AcgihBeiColumnKey, number>> =
  {
    id: 26,
    substanceName: 28,
    cas: 14,
    referenceYear: 12,
    determinant: 34,
    biologicalMatrix: 18,
    samplingTime: 20,
    beiValue: 14,
    unit: 18,
    notation: 14,
    status: 12,
    source: 14,
    sourceYear: 12,
    isCurated: 10,
    internalNotes: 44,
    sourcePage: 12,
    confidence: 12,
  };
