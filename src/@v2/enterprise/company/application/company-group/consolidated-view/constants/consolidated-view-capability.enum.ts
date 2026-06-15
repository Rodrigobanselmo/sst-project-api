export enum ConsolidatedViewCapabilityStatusEnum {
  IMPLEMENTED = 'implemented',
  NOT_IMPLEMENTED = 'not_implemented',
  DISABLED = 'disabled',
}

export const CONSOLIDATED_VIEW_CAPABILITIES = {
  participants: ConsolidatedViewCapabilityStatusEnum.IMPLEMENTED,
  charts: ConsolidatedViewCapabilityStatusEnum.IMPLEMENTED,
  indicators: ConsolidatedViewCapabilityStatusEnum.IMPLEMENTED,
  structuralGroupings: ConsolidatedViewCapabilityStatusEnum.NOT_IMPLEMENTED,
  riskAnalysisOperational: ConsolidatedViewCapabilityStatusEnum.IMPLEMENTED,
  riskNarrativeConcat: ConsolidatedViewCapabilityStatusEnum.IMPLEMENTED,
  indicatorsNarrative: ConsolidatedViewCapabilityStatusEnum.IMPLEMENTED,
  pdf: ConsolidatedViewCapabilityStatusEnum.IMPLEMENTED,
  emails: ConsolidatedViewCapabilityStatusEnum.DISABLED,
  reminders: ConsolidatedViewCapabilityStatusEnum.DISABLED,
  banner: ConsolidatedViewCapabilityStatusEnum.DISABLED,
  inventory: ConsolidatedViewCapabilityStatusEnum.DISABLED,
} as const;
