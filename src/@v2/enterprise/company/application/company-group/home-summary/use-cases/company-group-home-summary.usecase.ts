import { Injectable } from '@nestjs/common';

import { CompanyGroupHomeSummaryDAO } from '@/@v2/enterprise/company/database/dao/company-group/company-group-home-summary.dao';
import { AccessibleGroupCompaniesService } from '@/@v2/enterprise/company/application/shared/services/accessible-group-companies.service';

import { ICompanyGroupHomeSummaryUseCase } from './company-group-home-summary.types';

@Injectable()
export class CompanyGroupHomeSummaryUseCase {
  constructor(
    private readonly accessibleGroupCompaniesService: AccessibleGroupCompaniesService,
    private readonly companyGroupHomeSummaryDAO: CompanyGroupHomeSummaryDAO,
  ) {}

  async execute(
    params: ICompanyGroupHomeSummaryUseCase.Params,
  ): Promise<ICompanyGroupHomeSummaryUseCase.Result> {
    const { companyGroupId, companyGroupName, includedCompanyIds } =
      await this.accessibleGroupCompaniesService.resolveAccessibleGroupMembers({
        companyGroupId: params.companyGroupId,
        user: params.user,
      });

    const aggregated =
      await this.companyGroupHomeSummaryDAO.aggregate(includedCompanyIds);

    return {
      companyGroupId,
      companyGroupName,
      scope: 'group',
      includedCompanyIds,
      employees: aggregated.employees,
      companyData: aggregated.companyData,
      characterization: aggregated.characterization,
      documents: {
        status: 'not_available_in_group_scope',
        pgrLatestAt: null,
        pcmsoLatestAt: null,
      },
      actionPlan: {
        status: 'not_available_in_group_scope',
      },
      absenteeism: {
        status: 'partial',
        awayActive: aggregated.employees.away,
        records: null,
        lostDays: null,
      },
      forms: {
        status: 'available',
      },
    };
  }
}
