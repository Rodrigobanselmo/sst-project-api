import { Injectable } from '@nestjs/common';

import { CompanyGroupConsolidatedViewContextService } from '@/@v2/enterprise/company/application/company-group/consolidated-view/services/company-group-consolidated-view-context.service';
import { CompanyGroupConsolidatedViewQuestionsAnswersService } from '@/@v2/enterprise/company/application/company-group/consolidated-view/services/company-group-consolidated-view-questions-answers.service';

import { ICompanyGroupConsolidatedViewQuestionsAnswersUseCase } from './company-group-consolidated-view-questions-answers.types';

@Injectable()
export class CompanyGroupConsolidatedViewQuestionsAnswersUseCase {
  constructor(
    private readonly contextService: CompanyGroupConsolidatedViewContextService,
    private readonly questionsAnswersService: CompanyGroupConsolidatedViewQuestionsAnswersService,
  ) {}

  async execute(
    params: ICompanyGroupConsolidatedViewQuestionsAnswersUseCase.Params,
  ): Promise<ICompanyGroupConsolidatedViewQuestionsAnswersUseCase.Result> {
    const context = await this.contextService.resolve({
      companyGroupId: params.companyGroupId,
      applicationIds: params.applicationIds,
      user: params.user,
    });

    const listing = await this.questionsAnswersService.list({
      applications: context.applications,
      structureFingerprint: context.matchingSet.structureFingerprint,
    });

    return {
      mode: 'virtual_consolidated',
      businessGroupId: context.companyGroupId,
      businessGroupName: context.companyGroupName,
      applications: context.applications,
      structureFingerprint: listing.structureFingerprint,
      results: listing.results,
      participantStructures: listing.participantStructures,
      questionMetaById: listing.questionMetaById,
      totals: listing.totals,
    };
  }
}
