import { FormQuestionsAnswersDAO } from '@/@v2/forms/database/dao/form-questions-answers/form-questions-answers.dao';
import { Injectable } from '@nestjs/common';
import { IBrowseFormQuestionsAnswersUseCase } from './browse-form-questions-answers.types';

@Injectable()
export class BrowseFormQuestionsAnswersUseCase {
  constructor(private readonly formQuestionsAnswersDAO: FormQuestionsAnswersDAO) {}

  async execute(params: IBrowseFormQuestionsAnswersUseCase.Params) {
    const questionsAnswers = await this.formQuestionsAnswersDAO.browse({
      filters: {
        companyId: params.companyId,
        formApplicationId: params.formApplicationId,
        search: params.search,
      },
    });

    return questionsAnswers;
  }
}
