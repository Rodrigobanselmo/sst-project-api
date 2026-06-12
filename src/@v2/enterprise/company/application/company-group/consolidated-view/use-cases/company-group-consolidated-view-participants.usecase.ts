import { Injectable } from '@nestjs/common';

import { CompanyGroupConsolidatedViewContextService } from '@/@v2/enterprise/company/application/company-group/consolidated-view/services/company-group-consolidated-view-context.service';
import { CompanyGroupConsolidatedViewParticipantsService } from '@/@v2/enterprise/company/application/company-group/consolidated-view/services/company-group-consolidated-view-participants.service';

import { ICompanyGroupConsolidatedViewParticipantsUseCase } from './company-group-consolidated-view-participants.types';

@Injectable()
export class CompanyGroupConsolidatedViewParticipantsUseCase {
  constructor(
    private readonly contextService: CompanyGroupConsolidatedViewContextService,
    private readonly participantsService: CompanyGroupConsolidatedViewParticipantsService,
  ) {}

  async execute(
    params: ICompanyGroupConsolidatedViewParticipantsUseCase.Params,
  ): Promise<ICompanyGroupConsolidatedViewParticipantsUseCase.Result> {
    const context = await this.contextService.resolve({
      companyGroupId: params.companyGroupId,
      applicationIds: params.applicationIds,
      user: params.user,
    });

    const listing = await this.participantsService.list({
      applications: context.applications,
      search: params.search,
      hasResponded: params.hasResponded,
      page: params.page,
      limit: params.limit,
    });

    return {
      mode: 'virtual_consolidated',
      businessGroupId: context.companyGroupId,
      businessGroupName: context.companyGroupName,
      applications: context.applications,
      totals: listing.totals,
      filterSummary: listing.filterSummary,
      participants: listing.participants,
      pagination: listing.pagination,
    };
  }
}
