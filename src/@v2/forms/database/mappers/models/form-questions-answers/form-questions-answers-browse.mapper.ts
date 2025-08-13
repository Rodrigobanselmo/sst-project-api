import { FormQuestionsAnswersBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-questions-answers-browse.model';
import { FormQuestionGroupWithAnswersBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-question-group-with-answers-browse.model';

export type IFormQuestionsAnswersBrowseModelMapper = {
  results: FormQuestionGroupWithAnswersBrowseModel[];
};

export class FormQuestionsAnswersBrowseModelMapper {
  static toModel(prisma: IFormQuestionsAnswersBrowseModelMapper): FormQuestionsAnswersBrowseModel {
    return new FormQuestionsAnswersBrowseModel({
      results: prisma.results,
    });
  }
}
