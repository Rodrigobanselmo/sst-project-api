export type RiskSubTypeAiInstructionRecord = {
  subTypeId: number;
  useSystemDefault: boolean;
  instructions: string | null;
  positiveExamples: string | null;
  negativeExamples: string | null;
  cautionRules: string | null;
  preferredModel: string | null;
  revision: number;
  updatedById: number | null;
  updatedAt: string | null;
};

export type RiskSubTypeAiInstructionDraft = {
  useSystemDefault?: boolean;
  instructions?: string | null;
  positiveExamples?: string | null;
  negativeExamples?: string | null;
  cautionRules?: string | null;
  preferredModel?: string | null;
};

export type UpsertRiskSubTypeAiInstructionInput = {
  subTypeId: number;
  useSystemDefault: boolean;
  instructions?: string | null;
  positiveExamples?: string | null;
  negativeExamples?: string | null;
  cautionRules?: string | null;
  preferredModel?: string | null;
  updatedById: number;
};
