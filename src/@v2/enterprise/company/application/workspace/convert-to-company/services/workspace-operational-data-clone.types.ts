export type OperationalCloneMaps = {
  homogeneousGroupMap: Map<string, string>;
  riskFactorGroupDataMap: Map<string, string>;
  riskFactorDataMap: Map<string, string>;
  recMedMap: Map<string, string>;
  /** companyId do par @@unique([id, companyId]) usado em connect de RecMed */
  recMedCompanyIdMap: Map<string, string>;
  generateSourceMap: Map<string, string>;
  /** companyId do par @@unique([id, companyId]) usado em connect de GenerateSource */
  generateSourceCompanyIdMap: Map<string, string>;
  documentDataMap: Map<string, string>;
  riskFactorDataRecMap: Map<string, string>;
  actionPlanRulesMap: Map<number, number>;
  documentMap: Map<number, number>;
  riskFactorDocumentMap: Map<string, string>;
  systemFileMap: Map<string, string>;
  characterizationPhotoMap: Map<string, string>;
};

export type OperationalCloneCounts = {
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

export type OperationalCloneResult = {
  maps: OperationalCloneMaps;
  counts: OperationalCloneCounts;
  warnings: string[];
};

export const emptyOperationalCloneCounts = (): OperationalCloneCounts => ({
  homogeneousGroups: 0,
  characterizations: 0,
  environments: 0,
  riskFactorGroupData: 0,
  riskFactorData: 0,
  recMed: 0,
  generateSources: 0,
  riskFactorDataRec: 0,
  derivedMeasures: 0,
  actionPlanRules: 0,
  documentData: 0,
  riskFactorDocuments: 0,
  documents: 0,
  characterizationPhotoRecommendations: 0,
});
