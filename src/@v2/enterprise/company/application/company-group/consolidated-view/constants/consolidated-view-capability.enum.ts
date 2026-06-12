export enum ConsolidatedViewCapabilityStatusEnum {
  IMPLEMENTED = 'implemented',
  NOT_IMPLEMENTED = 'not_implemented',
  DISABLED = 'disabled',
}

export const CONSOLIDATED_VIEW_CAPABILITIES = {
  participants: ConsolidatedViewCapabilityStatusEnum.IMPLEMENTED,
  charts: ConsolidatedViewCapabilityStatusEnum.NOT_IMPLEMENTED,
  indicators: ConsolidatedViewCapabilityStatusEnum.NOT_IMPLEMENTED,
  structuralGroupings: ConsolidatedViewCapabilityStatusEnum.NOT_IMPLEMENTED,
  riskAnalysisOperational: ConsolidatedViewCapabilityStatusEnum.DISABLED,
  riskNarrativeConcat: ConsolidatedViewCapabilityStatusEnum.NOT_IMPLEMENTED,
  indicatorsNarrative: ConsolidatedViewCapabilityStatusEnum.NOT_IMPLEMENTED,
  pdf: ConsolidatedViewCapabilityStatusEnum.NOT_IMPLEMENTED,
  emails: ConsolidatedViewCapabilityStatusEnum.DISABLED,
  reminders: ConsolidatedViewCapabilityStatusEnum.DISABLED,
  banner: ConsolidatedViewCapabilityStatusEnum.DISABLED,
  inventory: ConsolidatedViewCapabilityStatusEnum.DISABLED,
} as const;
