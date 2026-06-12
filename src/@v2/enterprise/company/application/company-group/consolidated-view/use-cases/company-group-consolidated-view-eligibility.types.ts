import {
  ConsolidatedViewEligibleSet,
  ConsolidatedViewExcludedApplication,
} from '@/@v2/enterprise/company/application/company-group/consolidated-view/services/company-group-consolidated-view-eligibility.service';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

export namespace ICompanyGroupConsolidatedViewEligibilityUseCase {
  export type Params = {
    companyGroupId: number;
    applicationIds?: string[];
    user: UserPayloadDto;
  };

  export type Result = {
    companyGroupId: number;
    companyGroupName: string;
    hasEligibleSet: boolean;
    eligibleSets: ConsolidatedViewEligibleSet[];
    excludedApplications: ConsolidatedViewExcludedApplication[];
  };
}
