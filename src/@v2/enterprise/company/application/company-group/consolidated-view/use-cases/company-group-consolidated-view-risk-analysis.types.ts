import { ConsolidatedViewEligibleApplication } from '../services/company-group-consolidated-view-eligibility.service';

export type ConsolidatedViewRiskAnalysisCapabilities = {
  readOnly: true;
  canRecalculateRisk: false;
  canGenerateSources: false;
  canGenerateRecommendations: false;
  canAddToInventory: false;
  canAddToPgr: false;
  canEdit: false;
  canCreateSector: false;
  canCreateGeneratingSource: false;
};

export type ConsolidatedViewRiskAnalysisItemOrigin = {
  formApplicationId: string;
  companyId: string;
  riskAnalysisId: string | null;
};

export type ConsolidatedViewRiskAnalysisAiItem = {
  nome: string;
  justificativa: string;
};

export type ConsolidatedViewRiskAnalysisAiAnalysis = {
  frps: string | null;
  confidence: number | null;
  fontesGeradoras: ConsolidatedViewRiskAnalysisAiItem[];
  medidasEngenhariaRecomendadas: ConsolidatedViewRiskAnalysisAiItem[];
  medidasAdministrativasRecomendadas: ConsolidatedViewRiskAnalysisAiItem[];
};

export type ConsolidatedViewRiskAnalysisItem = {
  id: string;
  riskAnalysisId: string | null;
  formApplicationId: string;
  applicationName: string;
  companyId: string;
  companyName: string;
  establishmentId: string | null;
  establishmentName: string | null;
  sectorId: string;
  sectorName: string;
  hierarchyId: string;
  hierarchyName: string;
  hierarchyType: string;
  riskFactorId: string;
  riskFactor: string;
  riskCategory: string | null;
  riskType: string;
  probability: number | null;
  probabilityLabel: string;
  severity: number | null;
  severityLabel: string;
  riskLevel: number | null;
  occupationalRisk: string;
  generatingSources: string[];
  recommendations: string[];
  aiAnalysis: ConsolidatedViewRiskAnalysisAiAnalysis | null;
  status: string | null;
  inInventory: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  origin: ConsolidatedViewRiskAnalysisItemOrigin;
};

export type ConsolidatedViewRiskAnalysisSummary = {
  totalApplications: number;
  totalCompanies: number;
  totalRiskAnalyses: number;
  totalRiskFactors: number;
  totalSectors: number;
  totalConsolidatedRecords: number;
  hasData: boolean;
};

export type ConsolidatedViewRiskAnalysisWarning = {
  formApplicationId: string;
  applicationName: string;
  companyId: string;
  companyName: string;
  message: string;
};

export namespace ICompanyGroupConsolidatedViewRiskAnalysisUseCase {
  export type Params = {
    companyGroupId: number;
    applicationIds?: string[];
    user: import('@/shared/dto/user-payload.dto').UserPayloadDto;
  };

  export type Result = {
    mode: 'virtual_consolidated';
    businessGroupId: number;
    businessGroupName: string;
    applications: ConsolidatedViewEligibleApplication[];
    summary: ConsolidatedViewRiskAnalysisSummary;
    items: ConsolidatedViewRiskAnalysisItem[];
    warnings: ConsolidatedViewRiskAnalysisWarning[];
    capabilities: ConsolidatedViewRiskAnalysisCapabilities;
  };
}
