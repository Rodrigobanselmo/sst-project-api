export type RiskFactorAiSuggestionConfidence = 'low' | 'medium' | 'high';

export type RiskFactorAiSuggestionSourceOrigin =
  | 'ho-method-import'
  | 'ho-method-manual'
  | 'risk-factor-form';

export type RiskFactorAiSuggestionLimitsPayload = {
  nr15lt?: string;
  acgihTwa?: string;
  acgihStel?: string;
  acgihCeiling?: string;
  nioshRel?: string;
  nioshStel?: string;
  nioshCeiling?: string;
  nioshIdlh?: string;
  oshaPel?: string;
  oshaStel?: string;
  oshaCeiling?: string;
  aihaWeel?: string;
  aihaWeelCeiling?: string;
};

export type RiskFactorAiSuggestionKnownDataPayload = {
  risk?: string;
  symptoms?: string;
  severity?: number;
  carcinogenicityAcgih?: string;
  carcinogenicityLinach?: string;
  pv?: string;
  pe?: string;
  observations?: string;
  methodContext?: string;
  pdfObservations?: string;
  parseWarnings?: string[];
};

export type RiskFactorAiSuggestionSourceContextPayload = {
  origin: RiskFactorAiSuggestionSourceOrigin;
  methodInstitution?: string;
  methodCode?: string;
  methodDisplayName?: string;
};

export type RiskFactorAiSuggestionSourceTraceItem = {
  source: string;
  usedFor: Array<'risk' | 'symptoms' | 'severity' | 'organs'>;
  note?: string;
};

export namespace IRiskFactorAiSuggestionsUseCase {
  export type Params = {
    companyId: string;
    type: string;
    name?: string;
    cas?: string;
    synonyms?: string;
    unit?: string;
    method?: string;
    limits?: RiskFactorAiSuggestionLimitsPayload;
    knownData?: RiskFactorAiSuggestionKnownDataPayload;
    sourceContext?: RiskFactorAiSuggestionSourceContextPayload;
    customPrompt?: string;
    model?: string;
  };

  export type Result = {
    risk: string;
    symptoms: string;
    severity: number;
    severityAi?: number;
    severityAdjusted?: boolean;
    severityAdjustmentReason?: string;
    confidence: RiskFactorAiSuggestionConfidence;
    sourceTrace: RiskFactorAiSuggestionSourceTraceItem[];
    warnings: string[];
  };
}
