import {
  PcmsoExamRiskRuleScopeEnum,
  PcmsoExamRiskRuleSourceEnum,
  PcmsoExamRiskRuleStatusEnum,
} from '@prisma/client';

/** Abas do workbook de curadoria da biblioteca Regras Exame × Risco. */
export const EXAM_RISK_RULE_SHEET_NAMES = {
  DATA: 'Regras',
  INSTRUCTIONS: 'Instruções',
  REFERENCES: 'Referências',
} as const;

/**
 * Ordem das colunas (cabeçalho = nome técnico) para round-trip determinístico.
 * Uma linha = um exame sugerido da regra (regra sem exame = colunas de exame vazias).
 */
export const EXAM_RISK_RULE_COLUMN_ORDER = [
  // Âncoras (read-only)
  'ruleId',
  'ruleExamId',
  // Referência da regra (read-only)
  'scope',
  'source',
  'sourceIndicatorId',
  'referenceName',
  'riskNameSnapshot',
  'subTypeNameSnapshot',
  'agentNameNormalized',
  // Regra editável (agentName/agentCas só quando scope=AGENT)
  'agentName',
  'agentCas',
  'status',
  'isCurated',
  'rationale',
  // Exame
  'examId',
  'examName', // read-only (snapshot)
  'esocial27Code', // read-only informativo (4C fará o vínculo formal)
  'procedureNameSnapshot', // read-only informativo
  'validityInMonths',
  'considerBetweenDays',
  'collectionToleranceDays',
  'collectionMoment',
  'isMale',
  'isFemale',
  'isAdmission',
  'isPeriodic',
  'isChange',
  'isReturn',
  'isDismissal',
  'fromAge',
  'toAge',
  'minRiskDegree',
  'minRiskDegreeQuantity',
] as const;

export type ExamRiskRuleColumnKey =
  (typeof EXAM_RISK_RULE_COLUMN_ORDER)[number];

/** Colunas read-only: ignoradas na escrita; alteração vira aviso na prévia. */
export const EXAM_RISK_RULE_READONLY_COLUMNS: ExamRiskRuleColumnKey[] = [
  'ruleId',
  'ruleExamId',
  'scope',
  'source',
  'sourceIndicatorId',
  'referenceName',
  'riskNameSnapshot',
  'subTypeNameSnapshot',
  'agentNameNormalized',
  'examName',
  'esocial27Code',
  'procedureNameSnapshot',
];

/** Campos editáveis de regra (agentName/agentCas só quando scope=AGENT). */
export const EXAM_RISK_RULE_EDITABLE_RULE_COLUMNS: ExamRiskRuleColumnKey[] = [
  'agentName',
  'agentCas',
  'status',
  'isCurated',
  'rationale',
];

/** Campos editáveis de exame sugerido. */
export const EXAM_RISK_RULE_EDITABLE_EXAM_COLUMNS: ExamRiskRuleColumnKey[] = [
  'examId',
  'validityInMonths',
  'considerBetweenDays',
  'collectionToleranceDays',
  'collectionMoment',
  'isMale',
  'isFemale',
  'isAdmission',
  'isPeriodic',
  'isChange',
  'isReturn',
  'isDismissal',
  'fromAge',
  'toAge',
  'minRiskDegree',
  'minRiskDegreeQuantity',
];

export const EXAM_RISK_RULE_EXAM_BOOLEAN_FIELDS = [
  'isMale',
  'isFemale',
  'isAdmission',
  'isPeriodic',
  'isChange',
  'isReturn',
  'isDismissal',
] as const;

export const EXAM_RISK_RULE_EXAM_INT_FIELDS = [
  'validityInMonths',
  'considerBetweenDays',
  'collectionToleranceDays',
  'fromAge',
  'toAge',
  'minRiskDegree',
  'minRiskDegreeQuantity',
] as const;

export const EXAM_RISK_RULE_SCOPES = Object.values(PcmsoExamRiskRuleScopeEnum);
export const EXAM_RISK_RULE_SOURCES = Object.values(PcmsoExamRiskRuleSourceEnum);
export const EXAM_RISK_RULE_STATUSES = Object.values(
  PcmsoExamRiskRuleStatusEnum,
);

export const EXAM_RISK_RULE_BOOLEAN_TRUE_TOKENS = [
  'true',
  '1',
  'sim',
  's',
  'verdadeiro',
  'yes',
  'y',
];
export const EXAM_RISK_RULE_BOOLEAN_FALSE_TOKENS = [
  'false',
  '0',
  'nao',
  'n',
  'falso',
  'no',
];

export const EXAM_RISK_RULE_REFERENCE_VALUES: Record<string, string[]> = {
  scope: [...EXAM_RISK_RULE_SCOPES, '(read-only)'],
  source: [...EXAM_RISK_RULE_SOURCES, '(read-only)'],
  status: [...EXAM_RISK_RULE_STATUSES],
  'isCurated / booleanos': [
    ...EXAM_RISK_RULE_BOOLEAN_TRUE_TOKENS,
    ...EXAM_RISK_RULE_BOOLEAN_FALSE_TOKENS,
  ],
};

export const EXAM_RISK_RULE_COLUMN_WIDTHS: Partial<
  Record<ExamRiskRuleColumnKey, number>
> = {
  ruleId: 26,
  ruleExamId: 26,
  scope: 12,
  source: 12,
  sourceIndicatorId: 26,
  referenceName: 32,
  riskNameSnapshot: 28,
  subTypeNameSnapshot: 24,
  agentNameNormalized: 24,
  agentName: 24,
  agentCas: 14,
  status: 12,
  isCurated: 10,
  rationale: 40,
  examId: 10,
  examName: 30,
  esocial27Code: 14,
  procedureNameSnapshot: 32,
  collectionMoment: 22,
};
