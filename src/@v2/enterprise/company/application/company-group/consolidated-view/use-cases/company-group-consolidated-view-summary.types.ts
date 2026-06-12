import { CONSOLIDATED_VIEW_CAPABILITIES } from '@/@v2/enterprise/company/application/company-group/consolidated-view/constants/consolidated-view-capability.enum';
import { ConsolidatedViewEligibleApplication } from '@/@v2/enterprise/company/application/company-group/consolidated-view/services/company-group-consolidated-view-eligibility.service';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

export namespace ICompanyGroupConsolidatedViewSummaryUseCase {
  export type Params = {
    companyGroupId: number;
    applicationIds?: string[];
    user: UserPayloadDto;
  };

  export type Result = {
    mode: 'virtual_consolidated';
    businessGroupId: number;
    businessGroupName: string;
    formId: string;
    formName: string;
    includedFormIds: string[];
    structureFingerprint: string;
    applications: ConsolidatedViewEligibleApplication[];
    totals: {
      totalParticipants: number;
      totalAnswers: number;
      totalResponded: number;
      totalNotResponded: number;
      completionPercent: number;
    };
    capabilities: typeof CONSOLIDATED_VIEW_CAPABILITIES;
  };
}
