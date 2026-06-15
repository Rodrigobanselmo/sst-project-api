import { ConsolidatedViewEligibleApplication } from '@/@v2/enterprise/company/application/company-group/consolidated-view/services/company-group-consolidated-view-eligibility.service';
import {
  ConsolidatedViewParticipant,
  ConsolidatedViewParticipantsFilterSummary,
} from '@/@v2/enterprise/company/application/company-group/consolidated-view/services/company-group-consolidated-view-participants.service';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

export namespace ICompanyGroupConsolidatedViewParticipantsUseCase {
  export type Params = {
    companyGroupId: number;
    applicationIds?: string[];
    search?: string;
    hasResponded?: boolean;
    page?: number;
    limit?: number;
    user: UserPayloadDto;
  };

  export type Result = {
    mode: 'virtual_consolidated';
    businessGroupId: number;
    businessGroupName: string;
    applications: ConsolidatedViewEligibleApplication[];
    totals: {
      totalParticipants: number;
      totalResponded: number;
      totalNotResponded: number;
      completionPercent: number;
    };
    filterSummary: ConsolidatedViewParticipantsFilterSummary;
    participants: ConsolidatedViewParticipant[];
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  };
}
