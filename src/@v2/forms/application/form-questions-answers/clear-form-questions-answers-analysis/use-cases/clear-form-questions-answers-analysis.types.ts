export enum ClearFormAiAnalysisScopeEnum {
  APPLICATION = 'APPLICATION',
  RISK = 'RISK',
  HIERARCHY = 'HIERARCHY',
  HIERARCHY_GROUP = 'HIERARCHY_GROUP',
  HIERARCHY_GROUP_RISK = 'HIERARCHY_GROUP_RISK',
}

export namespace IClearFormQuestionsAnswersAnalysisUseCase {
  export type Params = {
    companyId: string;
    formApplicationId: string;
    scope: ClearFormAiAnalysisScopeEnum;
    dryRun?: boolean;
    riskId?: string;
    hierarchyId?: string;
    hierarchyGroupId?: string;
  };

  export type Result = {
    deletedCount: number;
    matchedCount: number;
    dryRun: boolean;
    scope: ClearFormAiAnalysisScopeEnum;
    filters: {
      riskId?: string | null;
      hierarchyId?: string | null;
      hierarchyGroupId?: string | null;
      expandedHierarchyIds?: string[];
    };
  };
}
