import { Injectable } from '@nestjs/common';

import { AccessibleGroupCompaniesService } from '@/@v2/enterprise/company/application/shared/services/accessible-group-companies.service';
import { CompanyGroupConsolidatedViewEligibilityService } from '@/@v2/enterprise/company/application/company-group/consolidated-view/services/company-group-consolidated-view-eligibility.service';

import { ICompanyGroupConsolidatedViewEligibilityUseCase } from './company-group-consolidated-view-eligibility.types';

@Injectable()
export class CompanyGroupConsolidatedViewEligibilityUseCase {
  constructor(
    private readonly accessibleGroupCompaniesService: AccessibleGroupCompaniesService,
    private readonly eligibilityService: CompanyGroupConsolidatedViewEligibilityService,
  ) {}

  async execute(
    params: ICompanyGroupConsolidatedViewEligibilityUseCase.Params,
  ): Promise<ICompanyGroupConsolidatedViewEligibilityUseCase.Result> {
    const { companyGroupId, companyGroupName, includedCompanyIds } =
      await this.accessibleGroupCompaniesService.resolveAccessibleGroupMembers({
        companyGroupId: params.companyGroupId,
        user: params.user,
      });

    const evaluation = await this.eligibilityService.evaluate({
      companyGroupId,
      accessibleCompanyIds: includedCompanyIds,
      applicationIds: params.applicationIds,
    });

    return {
      companyGroupId,
      companyGroupName,
      hasEligibleSet: evaluation.hasEligibleSet,
      eligibleSets: evaluation.eligibleSets,
      excludedApplications: evaluation.excludedApplications,
    };
  }
}
