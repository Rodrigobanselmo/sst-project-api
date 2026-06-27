export const ACGIH_BEI_COMPARISON_SHEET_NAMES = {
  DATA: 'ACGIH_BEI_Comparacao',
  INSTRUCTIONS: 'Instruções',
} as const;

/** Colunas da exportação read-only, na ordem aprovada. */
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
  'suggestedAction',
  'technicalDiff',
  'reviewNotes',
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
  suggestedAction: 24,
  technicalDiff: 60,
  reviewNotes: 60,
};
