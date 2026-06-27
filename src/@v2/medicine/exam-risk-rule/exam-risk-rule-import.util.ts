import {
  PcmsoExamRiskRuleStatusEnum,
} from '@prisma/client';

import {
  EXAM_RISK_RULE_BOOLEAN_FALSE_TOKENS,
  EXAM_RISK_RULE_BOOLEAN_TRUE_TOKENS,
  EXAM_RISK_RULE_EXAM_BOOLEAN_FIELDS,
  EXAM_RISK_RULE_EXAM_INT_FIELDS,
  EXAM_RISK_RULE_READONLY_COLUMNS,
  EXAM_RISK_RULE_STATUSES,
} from './exam-risk-rule-spreadsheet.constants';

export enum ExamRiskRuleImportClassification {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  UNCHANGED = 'UNCHANGED',
  REJECTED = 'REJECTED',
  CONFLICT = 'CONFLICT',
  INVALID = 'INVALID',
}

export type ExamRiskRuleRowError = {
  field: string;
  message: string;
};

export type RawSpreadsheetRow = Record<string, unknown>;

/** Campos editáveis de regra que vierem preenchidos na linha. */
export type RuleEditablePayload = {
  status?: PcmsoExamRiskRuleStatusEnum;
  isCurated?: boolean;
  rationale?: string | null;
  agentName?: string | null;
  agentCas?: string | null;
};

/** Config de exame sugerido normalizada (espelha PcmsoExamRiskRuleExam). */
export type ExamEditablePayload = {
  examId: number | null;
  validityInMonths: number | null;
  considerBetweenDays: number | null;
  collectionToleranceDays: number | null;
  collectionMoment: string | null;
  fromAge: number | null;
  toAge: number | null;
  minRiskDegree: number | null;
  minRiskDegreeQuantity: number | null;
  isMale: boolean;
  isFemale: boolean;
  isAdmission: boolean;
  isPeriodic: boolean;
  isChange: boolean;
  isReturn: boolean;
  isDismissal: boolean;
};

export type ParsedRuleRow = {
  rowNumber: number;
  ruleId: string;
  ruleExamId: string;
  rule: RuleEditablePayload;
  /** true se a linha traz qualquer dado de exame (examId ou config). */
  hasExamData: boolean;
  exam: ExamEditablePayload;
  errors: ExamRiskRuleRowError[];
  /** Colunas read-only que vieram preenchidas (apenas para aviso na prévia). */
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
    .toLowerCase();

/** boolean: vazio = undefined (mantém default do banco). */
export const parseOptionalBoolean = (
  value: unknown,
): { value: boolean | undefined; error: boolean } => {
  if (typeof value === 'boolean') return { value, error: false };
  const raw = toTrimmedString(value);
  if (raw === '') return { value: undefined, error: false };
  const token = normalizeToken(raw);
  if (EXAM_RISK_RULE_BOOLEAN_TRUE_TOKENS.includes(token))
    return { value: true, error: false };
  if (EXAM_RISK_RULE_BOOLEAN_FALSE_TOKENS.includes(token))
    return { value: false, error: false };
  return { value: undefined, error: true };
};

export const parseOptionalInt = (
  value: unknown,
): { value: number | null | undefined; error: boolean } => {
  const raw = toTrimmedString(value);
  if (raw === '') return { value: undefined, error: false };
  const num = Number(raw);
  if (!Number.isInteger(num) || num < 0) return { value: undefined, error: true };
  return { value: num, error: false };
};

const parseStatus = (
  value: unknown,
): { value: PcmsoExamRiskRuleStatusEnum | undefined; error: boolean } => {
  const raw = toTrimmedString(value);
  if (raw === '') return { value: undefined, error: false };
  const upper = raw.toUpperCase();
  if (EXAM_RISK_RULE_STATUSES.includes(upper as PcmsoExamRiskRuleStatusEnum))
    return { value: upper as PcmsoExamRiskRuleStatusEnum, error: false };
  return { value: undefined, error: true };
};

const EXAM_BOOLEAN_DEFAULTS: Record<
  (typeof EXAM_RISK_RULE_EXAM_BOOLEAN_FIELDS)[number],
  boolean
> = {
  isMale: true,
  isFemale: true,
  isAdmission: false,
  isPeriodic: false,
  isChange: false,
  isReturn: false,
  isDismissal: false,
};

/** Parse + validação de formato de uma linha. Pura (sem banco). */
export const parseRuleRow = (
  raw: RawSpreadsheetRow,
  rowNumber: number,
): ParsedRuleRow => {
  const errors: ExamRiskRuleRowError[] = [];

  const ruleId = toTrimmedString(raw.ruleId);
  const ruleExamId = toTrimmedString(raw.ruleExamId);

  // Regra editável
  const rule: RuleEditablePayload = {};
  const statusParsed = parseStatus(raw.status);
  if (statusParsed.error) {
    errors.push({
      field: 'status',
      message: `Status inválido: "${toTrimmedString(raw.status)}". Use ${EXAM_RISK_RULE_STATUSES.join(', ')}.`,
    });
  } else if (statusParsed.value !== undefined) {
    rule.status = statusParsed.value;
  }

  const curatedParsed = parseOptionalBoolean(raw.isCurated);
  if (curatedParsed.error) {
    errors.push({
      field: 'isCurated',
      message: `isCurated inválido: "${toTrimmedString(raw.isCurated)}". Use true/false.`,
    });
  } else if (curatedParsed.value !== undefined) {
    rule.isCurated = curatedParsed.value;
  }

  if (toTrimmedString(raw.rationale) !== '') {
    rule.rationale = toTrimmedString(raw.rationale);
  }
  if (toTrimmedString(raw.agentName) !== '') {
    rule.agentName = toTrimmedString(raw.agentName);
  }
  if (toTrimmedString(raw.agentCas) !== '') {
    rule.agentCas = toTrimmedString(raw.agentCas);
  }

  // Exame editável
  const examIdParsed = parseOptionalInt(raw.examId);
  if (examIdParsed.error) {
    errors.push({
      field: 'examId',
      message: `examId inválido: "${toTrimmedString(raw.examId)}". Use um inteiro ≥ 0.`,
    });
  }

  const intValues: Record<string, number | null> = {};
  for (const field of EXAM_RISK_RULE_EXAM_INT_FIELDS) {
    const parsed = parseOptionalInt(raw[field]);
    if (parsed.error) {
      errors.push({
        field,
        message: `${field} inválido: "${toTrimmedString(raw[field])}". Use um inteiro ≥ 0.`,
      });
      intValues[field] = null;
    } else {
      intValues[field] = parsed.value === undefined ? null : parsed.value;
    }
  }

  const boolValues: Record<string, boolean> = {};
  for (const field of EXAM_RISK_RULE_EXAM_BOOLEAN_FIELDS) {
    const parsed = parseOptionalBoolean(raw[field]);
    if (parsed.error) {
      errors.push({
        field,
        message: `${field} inválido: "${toTrimmedString(raw[field])}". Use true/false.`,
      });
      boolValues[field] = EXAM_BOOLEAN_DEFAULTS[field];
    } else {
      boolValues[field] =
        parsed.value === undefined ? EXAM_BOOLEAN_DEFAULTS[field] : parsed.value;
    }
  }

  const collectionMoment =
    toTrimmedString(raw.collectionMoment) === ''
      ? null
      : toTrimmedString(raw.collectionMoment);

  const exam: ExamEditablePayload = {
    examId: examIdParsed.value === undefined ? null : examIdParsed.value,
    validityInMonths: intValues.validityInMonths,
    considerBetweenDays: intValues.considerBetweenDays,
    collectionToleranceDays: intValues.collectionToleranceDays,
    collectionMoment,
    fromAge: intValues.fromAge,
    toAge: intValues.toAge,
    minRiskDegree: intValues.minRiskDegree,
    minRiskDegreeQuantity: intValues.minRiskDegreeQuantity,
    isMale: boolValues.isMale,
    isFemale: boolValues.isFemale,
    isAdmission: boolValues.isAdmission,
    isPeriodic: boolValues.isPeriodic,
    isChange: boolValues.isChange,
    isReturn: boolValues.isReturn,
    isDismissal: boolValues.isDismissal,
  };

  // A linha "traz exame" se há âncora de exame, examId, ou qualquer config
  // de exame não-vazia na planilha.
  const hasExamData =
    ruleExamId !== '' ||
    toTrimmedString(raw.examId) !== '' ||
    EXAM_RISK_RULE_EXAM_INT_FIELDS.some(
      (f) => toTrimmedString(raw[f]) !== '',
    ) ||
    EXAM_RISK_RULE_EXAM_BOOLEAN_FIELDS.some(
      (f) => toTrimmedString(raw[f]) !== '',
    ) ||
    collectionMoment !== null;

  // fromAge ≤ toAge quando ambos presentes
  if (
    intValues.fromAge !== null &&
    intValues.toAge !== null &&
    (intValues.fromAge as number) > (intValues.toAge as number)
  ) {
    errors.push({
      field: 'toAge',
      message: 'toAge deve ser maior ou igual a fromAge.',
    });
  }

  // collectionToleranceDays sem collectionMoment não faz sentido (aviso → erro leve)
  if (intValues.collectionToleranceDays !== null && collectionMoment === null) {
    errors.push({
      field: 'collectionToleranceDays',
      message:
        'collectionToleranceDays exige collectionMoment preenchido (coleta sem momento não faz sentido).',
    });
  }

  const readonlyTouched = EXAM_RISK_RULE_READONLY_COLUMNS.filter(
    (col) => toTrimmedString(raw[col]) !== '',
  );

  return {
    rowNumber,
    ruleId,
    ruleExamId,
    rule,
    hasExamData,
    exam,
    errors,
    readonlyTouched,
  };
};

/** true se a linha não traz nenhuma curadoria (regra+exame) preenchida. */
export const isRowEmpty = (parsed: ParsedRuleRow): boolean =>
  Object.keys(parsed.rule).length === 0 && !parsed.hasExamData;

export type FieldChange = {
  field: string;
  from: string;
  to: string;
};

const fmt = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '∅';
  return String(value);
};

/** Snapshot de regra (campos editáveis) para diff. */
export type ExistingRuleSnapshot = {
  status: PcmsoExamRiskRuleStatusEnum;
  isCurated: boolean;
  rationale: string | null;
  agentName: string | null;
  agentCas: string | null;
};

/** Diff de regra: só compara campos que vieram preenchidos na planilha. */
export const diffRulePayload = (
  existing: ExistingRuleSnapshot,
  incoming: RuleEditablePayload,
  options: { isAgentScope: boolean },
): FieldChange[] => {
  const changes: FieldChange[] = [];
  if (incoming.status !== undefined && incoming.status !== existing.status) {
    changes.push({ field: 'status', from: fmt(existing.status), to: fmt(incoming.status) });
  }
  if (
    incoming.isCurated !== undefined &&
    incoming.isCurated !== existing.isCurated
  ) {
    changes.push({
      field: 'isCurated',
      from: fmt(existing.isCurated),
      to: fmt(incoming.isCurated),
    });
  }
  if (
    incoming.rationale !== undefined &&
    incoming.rationale !== existing.rationale
  ) {
    changes.push({
      field: 'rationale',
      from: fmt(existing.rationale),
      to: fmt(incoming.rationale),
    });
  }
  // agentName/agentCas só são editáveis em scope=AGENT
  if (options.isAgentScope) {
    if (
      incoming.agentName !== undefined &&
      incoming.agentName !== existing.agentName
    ) {
      changes.push({
        field: 'agentName',
        from: fmt(existing.agentName),
        to: fmt(incoming.agentName),
      });
    }
    if (
      incoming.agentCas !== undefined &&
      incoming.agentCas !== existing.agentCas
    ) {
      changes.push({
        field: 'agentCas',
        from: fmt(existing.agentCas),
        to: fmt(incoming.agentCas),
      });
    }
  }
  return changes;
};

export type ExistingExamSnapshot = ExamEditablePayload;

const EXAM_DIFF_FIELDS: (keyof ExamEditablePayload)[] = [
  'examId',
  'validityInMonths',
  'considerBetweenDays',
  'collectionToleranceDays',
  'collectionMoment',
  'fromAge',
  'toAge',
  'minRiskDegree',
  'minRiskDegreeQuantity',
  'isMale',
  'isFemale',
  'isAdmission',
  'isPeriodic',
  'isChange',
  'isReturn',
  'isDismissal',
];

export const diffExamPayload = (
  existing: ExistingExamSnapshot,
  incoming: ExamEditablePayload,
): FieldChange[] =>
  EXAM_DIFF_FIELDS.filter((field) => existing[field] !== incoming[field]).map(
    (field) => ({
      field,
      from: fmt(existing[field]),
      to: fmt(incoming[field]),
    }),
  );

/** Descreve valores que serão gravados num novo exame (CREATE). */
export const describeExamPayload = (
  incoming: ExamEditablePayload,
): FieldChange[] =>
  EXAM_DIFF_FIELDS.filter((field) => {
    const v = incoming[field];
    return v !== null && v !== false; // mostra só o que tem conteúdo relevante
  }).map((field) => ({ field, from: '—', to: fmt(incoming[field]) }));
