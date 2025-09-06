import { HierarchyEnum, RiskFactorsEnum } from '@prisma/client';

export namespace IBrowseFormQuestionsAnswersRisksUseCase {
  export type Params = {
    companyId: string;
    formApplicationId: string;
  };

  export type Result = {
    entityRiskMap: Record<string, Record<string, { values: number[] }>>;
    entityMap: Record<string, { id: string; type: HierarchyEnum; name: string }>;
    riskMap: Record<
      string,
      {
        id: string;
        name: string;
        type: RiskFactorsEnum;
        subTypes: { sub_type: { id: number; name: string } }[];
      }
    >;
  };
}
