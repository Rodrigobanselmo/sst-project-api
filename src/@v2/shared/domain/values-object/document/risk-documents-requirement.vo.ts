
export type IRiskDocumentsRequirementVO = {
  isAso: boolean;
  isPGR: boolean;
  isPCMSO: boolean;
  isPPP: boolean;
  companyId: string | null;
  hierarchyId: string | null;
}

export class RiskDocumentsRequirementVO {
  isAso: boolean;
  isPGR: boolean;
  isPCMSO: boolean;
  isPPP: boolean;
  companyId: string | null;
  hierarchyId: string | null;

  constructor(params: IRiskDocumentsRequirementVO) {
    this.isAso = params.isAso;
    this.isPGR = params.isPGR;
    this.isPCMSO = params.isPCMSO;
    this.isPPP = params.isPPP;
    this.companyId = params.companyId
    this.hierarchyId = params.hierarchyId
  }
}
