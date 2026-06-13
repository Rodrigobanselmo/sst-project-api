import { Injectable } from '@nestjs/common';

import { CompanyGroupConsolidatedViewContextService } from '../services/company-group-consolidated-view-context.service';
import { CompanyGroupConsolidatedViewRiskAnalysisService } from '../services/company-group-consolidated-view-risk-analysis.service';
import { ICompanyGroupConsolidatedViewRiskAnalysisUseCase } from './company-group-consolidated-view-risk-analysis.types';

@Injectable()
export class CompanyGroupConsolidatedViewRiskAnalysisUseCase {
  constructor(
    private readonly contextService: CompanyGroupConsolidatedViewContextService,
    private readonly riskAnalysisService: CompanyGroupConsolidatedViewRiskAnalysisService,
  ) {}

  async execute(
    params: ICompanyGroupConsolidatedViewRiskAnalysisUseCase.Params,
  ): Promise<ICompanyGroupConsolidatedViewRiskAnalysisUseCase.Result> {
    const context = await this.contextService.resolve({
      companyGroupId: params.companyGroupId,
      applicationIds: params.applicationIds,
      user: params.user,
    });

    const listing = await this.riskAnalysisService.list({
      applications: context.applications,
    });

    return {
      mode: 'virtual_consolidated',
      businessGroupId: context.companyGroupId,
      businessGroupName: context.companyGroupName,
      applications: context.applications,
      summary: listing.summary,
      items: listing.items,
      warnings: listing.warnings,
      capabilities: this.riskAnalysisService.getCapabilities(),
    };
  }
}
