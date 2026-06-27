import {
  PcmsoEsocialProcedureStatusEnum,
  PcmsoEsocialProcedureTypeEnum,
} from '@prisma/client';

import {
  ESOCIAL_PROCEDURE_BOOLEAN_FALSE_TOKENS,
  ESOCIAL_PROCEDURE_BOOLEAN_TRUE_TOKENS,
  ESOCIAL_PROCEDURE_STATUSES,
  ESOCIAL_PROCEDURE_TECHNICAL_TYPES,
} from './esocial-procedure-spreadsheet.constants';

export enum EsocialProcedureImportClassification {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  UNCHANGED = 'UNCHANGED',
  REJECTED = 'REJECTED',
  CONFLICT = 'CONFLICT',
  INVALID = 'INVALID',
}

export type EsocialProcedureRowError = {
  field: string;
  message: string;
};

/** Curadoria normalizada a partir da planilha (apenas campos editáveis). */
export type EsocialProcedureCurationPayload = {
  isOccupationalRelevant: boolean;
  technicalType: PcmsoEsocialProcedureTypeEnum | null;
  status: PcmsoEsocialProcedureStatusEnum;
  internalNotes: string | null;
};

export type ParsedCurationRow = {
  rowNumber: number;
  procedureCode: string;
  payload: EsocialProcedureCurationPayload | null;
  errors: EsocialProcedureRowError[];
};

/** Linha bruta lida da planilha (chaves = cabeçalhos técnicos). */
export type RawSpreadsheetRow = Record<string, unknown>;

const toTrimmedString = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const normalizeToken = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

export const normalizeRelevantValue = (
  value: unknown,
): { value: boolean | null; error: boolean } => {
  if (value === null || value === undefined) return { value: false, error: false };
  if (typeof value === 'boolean') return { value, error: false };

  const raw = toTrimmedString(value);
  if (raw === '') return { value: false, error: false };

  const token = normalizeToken(raw);
  if (ESOCIAL_PROCEDURE_BOOLEAN_TRUE_TOKENS.includes(token)) {
    return { value: true, error: false };
  }
  if (ESOCIAL_PROCEDURE_BOOLEAN_FALSE_TOKENS.includes(token)) {
    return { value: false, error: false };
  }
  return { value: null, error: true };
};

export const normalizeTechnicalType = (
  value: unknown,
): { value: PcmsoEsocialProcedureTypeEnum | null; error: boolean } => {
  const raw = toTrimmedString(value);
  if (raw === '') return { value: null, error: false };

  const upper = raw.toUpperCase();
  if (ESOCIAL_PROCEDURE_TECHNICAL_TYPES.includes(upper as PcmsoEsocialProcedureTypeEnum)) {
    return { value: upper as PcmsoEsocialProcedureTypeEnum, error: false };
  }
  return { value: null, error: true };
};

export const normalizeStatus = (
  value: unknown,
): { value: PcmsoEsocialProcedureStatusEnum | null; error: boolean } => {
  const raw = toTrimmedString(value);
  if (raw === '') {
    return { value: PcmsoEsocialProcedureStatusEnum.DRAFT, error: false };
  }

  const upper = raw.toUpperCase();
  if (ESOCIAL_PROCEDURE_STATUSES.includes(upper as PcmsoEsocialProcedureStatusEnum)) {
    return { value: upper as PcmsoEsocialProcedureStatusEnum, error: false };
  }
  return { value: null, error: true };
};

const normalizeNotes = (value: unknown): string | null => {
  const raw = toTrimmedString(value);
  return raw === '' ? null : raw;
};

/**
 * Verifica se a linha bruta não traz nenhum valor de curadoria preenchido.
 * Usa os valores crus da planilha (antes de defaults como status=DRAFT).
 */
export const isRawCurationEmpty = (raw: RawSpreadsheetRow): boolean =>
  toTrimmedString(raw.isOccupationalRelevant) === '' &&
  toTrimmedString(raw.technicalType) === '' &&
  toTrimmedString(raw.status) === '' &&
  toTrimmedString(raw.internalNotes) === '';

/**
 * Faz o parse e a validação de uma linha bruta. Função pura: não acessa banco
 * nem o catálogo oficial (a validação de existência do procedureCode acontece
 * no service, que tem o catálogo carregado).
 */
export const parseCurationRow = (
  raw: RawSpreadsheetRow,
  rowNumber: number,
): ParsedCurationRow => {
  const errors: EsocialProcedureRowError[] = [];
  const procedureCode = toTrimmedString(raw.procedureCode);

  if (procedureCode === '') {
    errors.push({
      field: 'procedureCode',
      message: 'procedureCode é obrigatório.',
    });
  }

  const relevant = normalizeRelevantValue(raw.isOccupationalRelevant);
  if (relevant.error) {
    errors.push({
      field: 'isOccupationalRelevant',
      message: `Valor inválido: "${toTrimmedString(raw.isOccupationalRelevant)}". Use true/false ou sim/não.`,
    });
  }

  const technicalType = normalizeTechnicalType(raw.technicalType);
  if (technicalType.error) {
    errors.push({
      field: 'technicalType',
      message: `Tipo técnico inválido: "${toTrimmedString(raw.technicalType)}". Use ${ESOCIAL_PROCEDURE_TECHNICAL_TYPES.join(', ')} ou vazio.`,
    });
  }

  const status = normalizeStatus(raw.status);
  if (status.error) {
    errors.push({
      field: 'status',
      message: `Status inválido: "${toTrimmedString(raw.status)}". Use ${ESOCIAL_PROCEDURE_STATUSES.join(', ')}.`,
    });
  }

  if (errors.length) {
    return { rowNumber, procedureCode, payload: null, errors };
  }

  return {
    rowNumber,
    procedureCode,
    payload: {
      isOccupationalRelevant: relevant.value as boolean,
      technicalType: technicalType.value,
      status: status.value as PcmsoEsocialProcedureStatusEnum,
      internalNotes: normalizeNotes(raw.internalNotes),
    },
    errors: [],
  };
};

/** Curadoria atual relevante para o diff (campos editáveis). */
export type ExistingCurationSnapshot = {
  isOccupationalRelevant: boolean;
  technicalType: PcmsoEsocialProcedureTypeEnum | null;
  status: PcmsoEsocialProcedureStatusEnum;
  internalNotes: string | null;
};

export type CurationFieldChange = {
  field: keyof EsocialProcedureCurationPayload;
  from: string;
  to: string;
};

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) return '∅';
  return String(value);
};

const CURATION_PAYLOAD_FIELDS: (keyof EsocialProcedureCurationPayload)[] = [
  'isOccupationalRelevant',
  'technicalType',
  'status',
  'internalNotes',
];

/** Campos alterados entre a curadoria existente e o payload da planilha. */
export const diffCurationPayload = (
  existing: ExistingCurationSnapshot,
  incoming: EsocialProcedureCurationPayload,
): CurationFieldChange[] =>
  CURATION_PAYLOAD_FIELDS.filter((field) => existing[field] !== incoming[field]).map(
    (field) => ({
      field,
      from: formatValue(existing[field]),
      to: formatValue(incoming[field]),
    }),
  );

/** Valores que serão gravados em um CREATE (prévia sem registro anterior). */
export const describeCurationPayload = (
  payload: EsocialProcedureCurationPayload,
): CurationFieldChange[] =>
  CURATION_PAYLOAD_FIELDS.map((field) => ({
    field,
    from: '—',
    to: formatValue(payload[field]),
  }));
