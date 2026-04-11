import { HierarchyEnum, RiskFactorsEnum } from '@prisma/client';

export namespace IBrowseFormQuestionsAnswersRisksUseCase {
  export type Params = {
    companyId: string;
    formApplicationId: string;
  };

  export type Result = {
    entityRiskMap: Record<string, Record<string, { values: number[]; probability: number }>>;
    entityMap: Record<string, { id: string; type: HierarchyEnum; name: string }>;
    riskMap: Record<
      string,
      {
        id: string;
        name: string;
        severity: number;
        type: RiskFactorsEnum;
        subTypes: { sub_type: { id: number; name: string } }[];
      }
    >;
    groupedEntityRiskMap: Record<string, Record<string, { values: number[]; probability: number }>>;
    groupedEntityMap: Record<string, { id: string; name: string; type: string }>;
    hierarchyGroups: Array<{ id: string; name: string; hierarchyIds: string[] }>;
  };
}
