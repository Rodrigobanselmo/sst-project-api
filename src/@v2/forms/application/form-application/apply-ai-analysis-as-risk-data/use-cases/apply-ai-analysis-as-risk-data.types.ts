import { MeasuresTypeEnum, RecTypeEnum } from '@prisma/client';

export namespace IApplyAiAnalysisAsRiskDataUseCase {
  export type GenerateSourceItem = {
    name: string;
  };

  export type RecMedItem = {
    recName?: string;
    medName?: string;
    medType?: MeasuresTypeEnum;
    recType?: RecTypeEnum;
  };

  export type Params = {
    accessCompanyId: string;
    applicationId: string;
    hierarchyId: string;
    riskId: string;
    probability?: number;
    generateSourcesAddOnly?: GenerateSourceItem[];
    engsAddOnly?: RecMedItem[];
    recAddOnly?: RecMedItem[];
    admsAddOnly?: RecMedItem[];
  };

  export type Result = {
    success: boolean;
    operationalCompanyId: string;
    riskFactorDataId?: string;
  };
}
