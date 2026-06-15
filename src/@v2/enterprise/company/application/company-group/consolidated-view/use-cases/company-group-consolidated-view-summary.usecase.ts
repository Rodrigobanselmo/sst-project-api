import { Injectable } from '@nestjs/common';

import { CONSOLIDATED_VIEW_CAPABILITIES } from '@/@v2/enterprise/company/application/company-group/consolidated-view/constants/consolidated-view-capability.enum';
import { CompanyGroupConsolidatedViewContextService } from '@/@v2/enterprise/company/application/company-group/consolidated-view/services/company-group-consolidated-view-context.service';

import { ICompanyGroupConsolidatedViewSummaryUseCase } from './company-group-consolidated-view-summary.types';

@Injectable()
export class CompanyGroupConsolidatedViewSummaryUseCase {
  constructor(
    private readonly contextService: CompanyGroupConsolidatedViewContextService,
  ) {}

  async execute(
    params: ICompanyGroupConsolidatedViewSummaryUseCase.Params,
  ): Promise<ICompanyGroupConsolidatedViewSummaryUseCase.Result> {
    const context = await this.contextService.resolve({
      companyGroupId: params.companyGroupId,
      applicationIds: params.applicationIds,
      user: params.user,
    });

    const totalParticipants = context.applications.reduce(
      (sum, application) => sum + application.totalParticipants,
      0,
    );
    const totalAnswers = context.applications.reduce(
      (sum, application) => sum + application.totalAnswers,
      0,
    );
    const totalResponded = totalAnswers;
    const totalNotResponded = Math.max(totalParticipants - totalResponded, 0);
    const completionPercent =
      totalParticipants > 0
        ? Number(((totalResponded / totalParticipants) * 100).toFixed(2))
        : 0;

    return {
      mode: 'virtual_consolidated',
      businessGroupId: context.companyGroupId,
      businessGroupName: context.companyGroupName,
      formId: context.matchingSet.formId,
      formName: context.matchingSet.formName,
      includedFormIds: context.matchingSet.includedFormIds,
      structureFingerprint: context.matchingSet.structureFingerprint,
      applications: context.applications,
      totals: {
        totalParticipants,
        totalAnswers,
        totalResponded,
        totalNotResponded,
        completionPercent,
      },
      capabilities: CONSOLIDATED_VIEW_CAPABILITIES,
    };
  }
}
