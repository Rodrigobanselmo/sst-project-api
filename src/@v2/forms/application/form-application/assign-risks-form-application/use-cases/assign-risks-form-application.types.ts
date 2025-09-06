export namespace IAssignRisksFormApplicationUseCase {
  export type RiskAssignment = {
    riskId: string;
    probability: number;
    hierarchyId: string;
  };

  export type Params = {
    companyId: string;
    applicationId: string;
    risks: RiskAssignment[];
  };
}
