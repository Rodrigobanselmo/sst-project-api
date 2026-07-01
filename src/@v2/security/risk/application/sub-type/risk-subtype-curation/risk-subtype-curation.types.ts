export enum RiskSubtypeCurationFilterEnum {
  ALL = 'ALL',
  NONE = 'NONE',
  SPECIFIC = 'SPECIFIC',
}

export enum RiskSubtypeBulkAssignModeEnum {
  REPLACE = 'REPLACE',
  ADD = 'ADD',
}

export type RiskSubtypeCurationRiskRow = {
  riskFactorId: string;
  name: string;
  type: string;
  cas: string | null;
  esocialCode: string | null;
  subTypes: { id: number; name: string }[];
  status: string;
  isPCMSO: boolean;
};

export type RiskSubtypeBulkResult = {
  totalRequested: number;
  updated: number;
  skipped: number;
  errors: { riskFactorId: string; message: string }[];
};
