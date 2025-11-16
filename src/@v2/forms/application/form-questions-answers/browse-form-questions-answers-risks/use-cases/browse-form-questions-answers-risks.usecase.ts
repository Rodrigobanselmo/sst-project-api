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

    // Return only the legacy format for backward compatibility
    return {
      entityRiskMap: result.entityRiskMap,
      riskMap: result.riskMap,
      entityMap: result.entityMap,
    };
  }
}
