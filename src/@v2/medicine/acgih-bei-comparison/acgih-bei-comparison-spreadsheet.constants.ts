export const ACGIH_BEI_COMPARISON_SHEET_NAMES = {
  DATA: 'ACGIH_BEI_Comparacao',
  INSTRUCTIONS: 'Instruções',
} as const;

/** Colunas da exportação read-only, na ordem aprovada.
 * 4L.1a: colunas de contexto/readiness adicionadas ao final, sem remover nem
 * renomear as existentes. */
export const ACGIH_BEI_COMPARISON_COLUMN_ORDER = [
  'acgihBeiId',
  'substanceName',
  'cas',
  'determinant',
  'biologicalMatrix',
  'samplingTime',
  'beiValue',
  'unit',
  'confidence',
  'nr7MatchStatus',
  'nr7IndicatorId',
  'nr7SubstanceName',
  'nr7IndicatorName',
  'examRiskRuleMatchStatus',
  'examRiskRuleId',
  'examNameSnapshot',
  'comparisonStatus',
  // 4O.3 — status operacional/efetivo (mantém comparisonStatus bruto ao lado).
  'operationalStatus',
  'suggestedAction',
  'technicalDiff',
  'reviewNotes',
  // 4L.1a — contexto/readiness.
  'acgihBeiStatus',
  'acgihBeiIsCurated',
  'acgihBeiSourceYear',
  'acgihBeiSourcePage',
  'nr7Status',
  'nr7PendencyCount',
  'nr7PendencyCodes',
  'examRiskRuleStatus',
  'examRiskRuleIsCurated',
  'hasComplementaryReference',
  // 4O.1 — decisão técnica de curadoria.
  'reviewDecision',
  'reviewTechnicalNote',
  'reviewReviewedBy',
  'reviewReviewedAt',
  'reviewIsStale',
] as const;

export type AcgihBeiComparisonColumnKey =
  (typeof ACGIH_BEI_COMPARISON_COLUMN_ORDER)[number];

export const ACGIH_BEI_COMPARISON_COLUMN_WIDTHS: Partial<
  Record<AcgihBeiComparisonColumnKey, number>
> = {
  acgihBeiId: 26,
  substanceName: 26,
  cas: 14,
  determinant: 30,
  biologicalMatrix: 16,
  samplingTime: 18,
  beiValue: 16,
  unit: 14,
  confidence: 12,
  nr7MatchStatus: 14,
  nr7IndicatorId: 26,
  nr7SubstanceName: 24,
  nr7IndicatorName: 28,
  examRiskRuleMatchStatus: 18,
  examRiskRuleId: 26,
  examNameSnapshot: 30,
  comparisonStatus: 20,
  operationalStatus: 24,
  suggestedAction: 24,
  technicalDiff: 60,
  reviewNotes: 60,
  acgihBeiStatus: 16,
  acgihBeiIsCurated: 16,
  acgihBeiSourceYear: 18,
  acgihBeiSourcePage: 18,
  nr7Status: 14,
  nr7PendencyCount: 16,
  nr7PendencyCodes: 40,
  examRiskRuleStatus: 18,
  examRiskRuleIsCurated: 18,
  hasComplementaryReference: 26,
  reviewDecision: 28,
  reviewTechnicalNote: 60,
  reviewReviewedBy: 24,
  reviewReviewedAt: 22,
  reviewIsStale: 26,
};

/** Rótulos legíveis SOMENTE para as colunas novas (4L.1a). As colunas
 * existentes mantêm a chave camelCase como cabeçalho (compatibilidade). */
export const ACGIH_BEI_COMPARISON_COLUMN_HEADERS: Partial<
  Record<AcgihBeiComparisonColumnKey, string>
> = {
  operationalStatus: 'Status operacional',
  acgihBeiStatus: 'Status ACGIH/BEI',
  acgihBeiIsCurated: 'Curado ACGIH/BEI',
  acgihBeiSourceYear: 'Ano/fonte ACGIH/BEI',
  acgihBeiSourcePage: 'Página/fonte ACGIH/BEI',
  nr7Status: 'Status NR-7',
  nr7PendencyCount: 'Pendências NR-7 (qtd)',
  nr7PendencyCodes: 'Pendências NR-7 (códigos)',
  examRiskRuleStatus: 'Status Biblioteca',
  examRiskRuleIsCurated: 'Curada Biblioteca',
  hasComplementaryReference: 'Fonte complementar já registrada',
  reviewDecision: 'Decisão técnica',
  reviewTechnicalNote: 'Nota técnica da decisão',
  reviewReviewedBy: 'Revisado por',
  reviewReviewedAt: 'Revisado em',
  reviewIsStale: 'Decisão desatualizada (recalculada)',
};
