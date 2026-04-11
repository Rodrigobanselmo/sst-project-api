import { Injectable } from '@nestjs/common';
import { FormQuestionsAnswersRisksService } from '../../shared/services/form-questions-answers-risks.service';
import { IBrowseFormQuestionsAnswersRisksUseCase } from './browse-form-questions-answers-risks.types';

@Injectable()
export class BrowseFormQuestionsAnswersRisksUseCase {
  constructor(private readonly formQuestionsAnswersRisksService: FormQuestionsAnswersRisksService) {}

  async execute(params: IBrowseFormQuestionsAnswersRisksUseCase.Params): Promise<IBrowseFormQuestionsAnswersRisksUseCase.Result> {
    const result = await this.formQuestionsAnswersRisksService.getFormQuestionsAnswersRisks({
      companyId: params.companyId,
      formApplicationId: params.formApplicationId,
    });

    return {
      entityRiskMap: result.entityRiskMap,
      riskMap: result.riskMap,
      entityMap: result.entityMap,
      groupedEntityRiskMap: result.groupedEntityRiskMap,
      groupedEntityMap: result.groupedEntityMap,
      hierarchyGroups: result.hierarchyGroups,
    };
  }
}
