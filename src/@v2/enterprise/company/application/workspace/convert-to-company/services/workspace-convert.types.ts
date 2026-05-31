export type WorkspaceConvertPreviewResult = {
  workspace: {
    id: string;
    name: string;
    cnpj: string | null;
    isOwner: boolean;
    abbreviation: string | null;
  };
  proposedCompany: {
    name: string;
    cnpj: string | null;
    fantasy: string | null;
    initials: string | null;
  };
  companyGroup: {
    id: number;
    name: string;
  };
  counts: {
    employees: number;
    hierarchies: number;
    hierarchiesMoved: number;
    hierarchiesCloned: number;
    homogeneousGroups: number;
    characterizations: number;
    environments: number;
    riskFactorData: number;
    riskFactorDataRec: number;
    derivedMeasures: number;
    actionPlanRules: number;
    documentData: number;
    riskFactorDocuments: number;
    documents: number;
    formApplications: number;
  };
  affectedFormApplications: {
    id: string;
    name: string;
    scopeType: string;
  }[];
  blocks: string[];
  warnings: string[];
};

export type WorkspaceConvertOperationalSummary = {
  homogeneousGroups: number;
  characterizations: number;
  environments: number;
  riskFactorGroupData: number;
  riskFactorData: number;
  recMed: number;
  generateSources: number;
  riskFactorDataRec: number;
  derivedMeasures: number;
  actionPlanRules: number;
  documentData: number;
  riskFactorDocuments: number;
  documents: number;
  characterizationPhotoRecommendations: number;
};

export type WorkspaceConvertResult = {
  newCompanyId: string;
  newWorkspaceId: string;
  migratedEmployeesCount: number;
  migratedHierarchiesCount: number;
  copiedRiskDataCount: number;
  convertedFormApplicationsCount: number;
  operational: WorkspaceConvertOperationalSummary;
  warnings: string[];
};

export type WorkspaceConvertCompanyGroupOption = {
  id: number;
  name: string;
  description: string | null;
};
