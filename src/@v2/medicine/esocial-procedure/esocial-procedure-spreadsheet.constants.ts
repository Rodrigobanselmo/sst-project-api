import {
  PcmsoEsocialProcedureStatusEnum,
  PcmsoEsocialProcedureTypeEnum,
} from '@prisma/client';

/** Nomes das abas do workbook de curadoria da Tabela 27. */
export const ESOCIAL_PROCEDURE_SHEET_NAMES = {
  DATA: 'Procedimentos',
  INSTRUCTIONS: 'Instruções',
  REFERENCES: 'Referências',
} as const;

/**
 * Cabeçalhos = nomes técnicos dos campos. Mantido propositalmente igual aos
 * nomes de campo para que o parsing (sheet_to_json) seja determinístico e o
 * round-trip export→import preserve as colunas exatamente como especificado.
 */
export const ESOCIAL_PROCEDURE_COLUMN_ORDER = [
  'procedureCode',
  'procedureNameSnapshot',
  'isOccupationalRelevant',
  'technicalType',
  'status',
  'internalNotes',
] as const;

export type EsocialProcedureColumnKey =
  (typeof ESOCIAL_PROCEDURE_COLUMN_ORDER)[number];

/** Colunas oficiais (referência/validação) — nunca alteram a Tabela 27. */
export const ESOCIAL_PROCEDURE_OFFICIAL_COLUMNS: EsocialProcedureColumnKey[] = [
  'procedureCode',
  'procedureNameSnapshot',
];

/** Colunas de curadoria (editáveis/importáveis). */
export const ESOCIAL_PROCEDURE_EDITABLE_COLUMNS: EsocialProcedureColumnKey[] = [
  'isOccupationalRelevant',
  'technicalType',
  'status',
];

export const ESOCIAL_PROCEDURE_TECHNICAL_TYPES = Object.values(
  PcmsoEsocialProcedureTypeEnum,
) as PcmsoEsocialProcedureTypeEnum[];

export const ESOCIAL_PROCEDURE_STATUSES = Object.values(
  PcmsoEsocialProcedureStatusEnum,
) as PcmsoEsocialProcedureStatusEnum[];

/** Tokens aceitos para isOccupationalRelevant na importação. */
export const ESOCIAL_PROCEDURE_BOOLEAN_TRUE_TOKENS = [
  'true',
  '1',
  'sim',
  's',
  'verdadeiro',
  'yes',
  'y',
];
export const ESOCIAL_PROCEDURE_BOOLEAN_FALSE_TOKENS = [
  'false',
  '0',
  'nao',
  'n',
  'falso',
  'no',
];

export const ESOCIAL_PROCEDURE_REFERENCE_VALUES: Record<string, string[]> = {
  isOccupationalRelevant: [
    ...ESOCIAL_PROCEDURE_BOOLEAN_TRUE_TOKENS,
    ...ESOCIAL_PROCEDURE_BOOLEAN_FALSE_TOKENS,
  ],
  technicalType: [...ESOCIAL_PROCEDURE_TECHNICAL_TYPES, '(vazio = não classificado)'],
  status: [...ESOCIAL_PROCEDURE_STATUSES, '(vazio = DRAFT)'],
};

export const ESOCIAL_PROCEDURE_COLUMN_WIDTHS: Record<
  EsocialProcedureColumnKey,
  number
> = {
  procedureCode: 16,
  procedureNameSnapshot: 60,
  isOccupationalRelevant: 22,
  technicalType: 18,
  status: 14,
  internalNotes: 50,
};
