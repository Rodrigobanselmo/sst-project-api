export namespace ICreatorDocumentPGR {
  export type Params = {
    documentVersionId: string;
    homogeneousGroupsIds?: string[];
    documentDate?: string;
    riskFilter?: import('@/@v2/documents/domain/types/document-generation-risk-filter.type').DocumentGenerationRiskFilterSnapshot;
  };
}
