import {
  PcmsoAcgihBeiIndicatorConfidenceEnum,
  PcmsoAcgihBeiIndicatorSourceEnum,
  PcmsoAcgihBeiIndicatorStatusEnum,
} from '@prisma/client';

import {
  ACGIH_BEI_BOOLEAN_FALSE_TOKENS,
  ACGIH_BEI_BOOLEAN_TRUE_TOKENS,
  ACGIH_BEI_CONFIDENCE_TOKENS,
  ACGIH_BEI_READONLY_COLUMNS,
  ACGIH_BEI_SOURCES,
  ACGIH_BEI_STATUSES,
} from './acgih-bei-indicator-spreadsheet.constants';

export enum AcgihBeiImportClassification {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  UNCHANGED = 'UNCHANGED',
  REJECTED = 'REJECTED',
  CONFLICT = 'CONFLICT',
  INVALID = 'INVALID',
}

export type AcgihBeiRowError = {
  field: string;
  message: string;
};

export type RawSpreadsheetRow = Record<string, unknown>;

/** Campos editáveis do indicador (espelha PcmsoAcgihBeiIndicator, sem derivados). */
export type AcgihBeiPayload = {
  substanceName: string;
  cas: string | null;
  referenceYear: number | null;
  determinant: string | null;
  biologicalMatrix: string | null;
  samplingTime: string | null;
  beiValue: string | null;
  unit: string | null;
  notation: string | null;
  status: PcmsoAcgihBeiIndicatorStatusEnum;
  source: PcmsoAcgihBeiIndicatorSourceEnum;
  sourceYear: number | null;
  isCurated: boolean;
  internalNotes: string | null;
  sourcePage: string | null;
  confidence: PcmsoAcgihBeiIndicatorConfidenceEnum | null;
};

export type ParsedAcgihBeiRow = {
  rowNumber: number;
  id: string;
  payload: AcgihBeiPayload | null;
  dedupeKey: string;
  errors: AcgihBeiRowError[];
  readonlyTouched: string[];
};

const toTrimmedString = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const normalizeToken = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();

/** Normalização exposta para o service (substanceNameNormalized e dedupeKey). */
export const normalizeText = (value?: string | null): string =>
  value ? normalizeToken(value) : '';

/** Chave natural normalizada: substância|cas|determinante|matriz|momento. */
export const buildDedupeKey = (parts: {
  substanceName?: string | null;
  cas?: string | null;
  determinant?: string | null;
  biologicalMatrix?: string | null;
  samplingTime?: string | null;
}): string =>
  [
    normalizeText(parts.substanceName),
    normalizeText(parts.cas),
    normalizeText(parts.determinant),
    normalizeText(parts.biologicalMatrix),
    normalizeText(parts.samplingTime),
  ].join('|');

export const parseOptionalBoolean = (
  value: unknown,
): { value: boolean | undefined; error: boolean } => {
  if (typeof value === 'boolean') return { value, error: false };
  const raw = toTrimmedString(value);
  if (raw === '') return { value: undefined, error: false };
  const token = normalizeToken(raw);
  if (ACGIH_BEI_BOOLEAN_TRUE_TOKENS.includes(token))
    return { value: true, error: false };
  if (ACGIH_BEI_BOOLEAN_FALSE_TOKENS.includes(token))
    return { value: false, error: false };
  return { value: undefined, error: true };
};

export const parseOptionalYear = (
  value: unknown,
): { value: number | null; error: boolean } => {
  const raw = toTrimmedString(value);
  if (raw === '') return { value: null, error: false };
  const num = Number(raw);
  if (!Number.isInteger(num) || num < 1900 || num > 2200)
    return { value: null, error: true };
  return { value: num, error: false };
};

export const parseConfidence = (
  value: unknown,
): { value: PcmsoAcgihBeiIndicatorConfidenceEnum | null; error: boolean } => {
  const raw = toTrimmedString(value);
  if (raw === '') return { value: null, error: false };
  const token = normalizeToken(raw);
  const mapped = ACGIH_BEI_CONFIDENCE_TOKENS[token];
  if (mapped) return { value: mapped, error: false };
  return { value: null, error: true };
};

const parseStatus = (
  value: unknown,
): { value: PcmsoAcgihBeiIndicatorStatusEnum; error: boolean } => {
  const raw = toTrimmedString(value);
  if (raw === '')
    return { value: PcmsoAcgihBeiIndicatorStatusEnum.DRAFT, error: false };
  const upper = raw.toUpperCase();
  if (ACGIH_BEI_STATUSES.includes(upper as PcmsoAcgihBeiIndicatorStatusEnum))
    return { value: upper as PcmsoAcgihBeiIndicatorStatusEnum, error: false };
  return { value: PcmsoAcgihBeiIndicatorStatusEnum.DRAFT, error: true };
};

const parseSource = (
  value: unknown,
): { value: PcmsoAcgihBeiIndicatorSourceEnum; error: boolean } => {
  const raw = toTrimmedString(value);
  if (raw === '')
    return { value: PcmsoAcgihBeiIndicatorSourceEnum.ACGIH_BEI, error: false };
  const upper = raw.toUpperCase();
  if (ACGIH_BEI_SOURCES.includes(upper as PcmsoAcgihBeiIndicatorSourceEnum))
    return { value: upper as PcmsoAcgihBeiIndicatorSourceEnum, error: false };
  return { value: PcmsoAcgihBeiIndicatorSourceEnum.ACGIH_BEI, error: true };
};

const emptyToNull = (value: unknown): string | null => {
  const raw = toTrimmedString(value);
  return raw === '' ? null : raw;
};

/** Campos editáveis crus (sem id) — usados para detectar linha vazia. */
const RAW_EDITABLE_COLUMNS = [
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
];

export const isRawRowEmpty = (raw: RawSpreadsheetRow): boolean =>
  RAW_EDITABLE_COLUMNS.every((col) => toTrimmedString(raw[col]) === '');

/** Parse + validação de formato de uma linha. Pura (sem banco). */
export const parseAcgihBeiRow = (
  raw: RawSpreadsheetRow,
  rowNumber: number,
): ParsedAcgihBeiRow => {
  const errors: AcgihBeiRowError[] = [];
  const id = toTrimmedString(raw.id);

  const readonlyTouched = ACGIH_BEI_READONLY_COLUMNS.filter(
    (col) => col !== 'id' && toTrimmedString(raw[col]) !== '',
  );

  // Linha vazia (sem qualquer campo editável) → sem payload, sem erro.
  if (isRawRowEmpty(raw)) {
    return { rowNumber, id, payload: null, dedupeKey: '', errors: [], readonlyTouched };
  }

  const substanceName = toTrimmedString(raw.substanceName);
  if (substanceName === '') {
    errors.push({
      field: 'substanceName',
      message: 'substanceName é obrigatório quando a linha tem dados.',
    });
  }

  const referenceYear = parseOptionalYear(raw.referenceYear);
  if (referenceYear.error) {
    errors.push({
      field: 'referenceYear',
      message: `referenceYear inválido: "${toTrimmedString(raw.referenceYear)}".`,
    });
  }

  const sourceYear = parseOptionalYear(raw.sourceYear);
  if (sourceYear.error) {
    errors.push({
      field: 'sourceYear',
      message: `sourceYear inválido: "${toTrimmedString(raw.sourceYear)}".`,
    });
  }

  const status = parseStatus(raw.status);
  if (status.error) {
    errors.push({
      field: 'status',
      message: `status inválido: "${toTrimmedString(raw.status)}". Use ${ACGIH_BEI_STATUSES.join(', ')}.`,
    });
  }

  const source = parseSource(raw.source);
  if (source.error) {
    errors.push({
      field: 'source',
      message: `source inválido: "${toTrimmedString(raw.source)}". Use ${ACGIH_BEI_SOURCES.join(', ')}.`,
    });
  }

  const confidence = parseConfidence(raw.confidence);
  if (confidence.error) {
    errors.push({
      field: 'confidence',
      message: `confidence inválido: "${toTrimmedString(raw.confidence)}". Use HIGH/MEDIUM/LOW ou Alta/Média/Baixa.`,
    });
  }

  const isCurated = parseOptionalBoolean(raw.isCurated);
  if (isCurated.error) {
    errors.push({
      field: 'isCurated',
      message: `isCurated inválido: "${toTrimmedString(raw.isCurated)}". Use true/false.`,
    });
  }

  const cas = emptyToNull(raw.cas);
  const determinant = emptyToNull(raw.determinant);
  const biologicalMatrix = emptyToNull(raw.biologicalMatrix);
  const samplingTime = emptyToNull(raw.samplingTime);

  const dedupeKey = buildDedupeKey({
    substanceName,
    cas,
    determinant,
    biologicalMatrix,
    samplingTime,
  });

  if (errors.length) {
    return { rowNumber, id, payload: null, dedupeKey, errors, readonlyTouched };
  }

  return {
    rowNumber,
    id,
    dedupeKey,
    payload: {
      substanceName,
      cas,
      referenceYear: referenceYear.value,
      determinant,
      biologicalMatrix,
      samplingTime,
      beiValue: emptyToNull(raw.beiValue),
      unit: emptyToNull(raw.unit),
      notation: emptyToNull(raw.notation),
      status: status.value,
      source: source.value,
      sourceYear: sourceYear.value,
      isCurated: isCurated.value ?? false,
      internalNotes: emptyToNull(raw.internalNotes),
      sourcePage: emptyToNull(raw.sourcePage),
      confidence: confidence.value,
    },
    errors: [],
    readonlyTouched,
  };
};

export type AcgihBeiFieldChange = {
  field: keyof AcgihBeiPayload;
  from: string;
  to: string;
};

const fmt = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '∅';
  return String(value);
};

export type ExistingAcgihBeiSnapshot = AcgihBeiPayload;

const PAYLOAD_FIELDS: (keyof AcgihBeiPayload)[] = [
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
];

export const diffAcgihBeiPayload = (
  existing: ExistingAcgihBeiSnapshot,
  incoming: AcgihBeiPayload,
): AcgihBeiFieldChange[] =>
  PAYLOAD_FIELDS.filter((field) => existing[field] !== incoming[field]).map(
    (field) => ({ field, from: fmt(existing[field]), to: fmt(incoming[field]) }),
  );

/** Valores que serão gravados em um CREATE (sem registro anterior). */
export const describeAcgihBeiPayload = (
  payload: AcgihBeiPayload,
): AcgihBeiFieldChange[] =>
  PAYLOAD_FIELDS.filter((field) => {
    const v = payload[field];
    return v !== null && v !== '' && v !== false;
  }).map((field) => ({ field, from: '—', to: fmt(payload[field]) }));
