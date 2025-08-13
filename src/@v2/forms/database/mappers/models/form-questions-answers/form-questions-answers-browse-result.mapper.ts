import { FormQuestionTypeEnum } from '@/@v2/forms/domain/enums/form-question-type.enum';
import { FormQuestionGroupWithAnswersBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-question-group-with-answers-browse.model';
import { FormQuestionWithAnswersBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-question-with-answers-browse.model';
import { FormAnswerBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-answer-browse.model';

export type IFormQuestionsAnswersBrowseResultModelMapper = {
  group_id: string;
  group_form_application_id: string;
  group_name: string;
  group_description: string | null;
  group_order: number;
  question_id: string;
  question_required: boolean;
  question_order: number;
  question_details_id: string;
  question_details_text: string;
  question_details_type: string;
  question_options: {
    option_id: string;
    option_text: string;
    option_value: string | null;
    option_order: number;
  }[];
  answers: {
    answer_id: string;
    answer_value: string | null;
    participants_answers_id: string;
    selected_options: string[];
  }[];
};

export class FormQuestionsAnswersBrowseResultModelMapper {
  static toModels(prisma: IFormQuestionsAnswersBrowseResultModelMapper[]): FormQuestionGroupWithAnswersBrowseModel[] {
    // Group the results by group_id using a simple object
    const groupsRecord: Record<
      string,
      {
        group: FormQuestionGroupWithAnswersBrowseModel;
        questionsRecord: Record<string, FormQuestionWithAnswersBrowseModel>;
      }
    > = {};

    prisma.forEach((result) => {
      // Initialize group if it doesn't exist
      if (!groupsRecord[result.group_id]) {
        groupsRecord[result.group_id] = {
          group: new FormQuestionGroupWithAnswersBrowseModel({
            id: result.group_id,
            name: result.group_name,
            description: result.group_description || undefined,
            order: result.group_order,
            questions: [],
            identifier: !!result.group_form_application_id,
          }),
          questionsRecord: {},
        };
      }

      const groupData = groupsRecord[result.group_id];

      // Initialize question if it doesn't exist
      if (!groupData.questionsRecord[result.question_id]) {
        const questionOptions = result.question_options;
        const answers = result.answers;

        groupData.questionsRecord[result.question_id] = new FormQuestionWithAnswersBrowseModel({
          id: result.question_id,
          required: result.question_required,
          order: result.question_order,
          details: {
            id: result.question_details_id,
            text: result.question_details_text,
            type: FormQuestionTypeEnum[result.question_details_type as keyof typeof FormQuestionTypeEnum],
          },
          options: questionOptions.map((option) => ({
            id: option.option_id,
            text: option.option_text,
            value: option.option_value ? Number(option.option_value) : undefined,
            order: option.option_order,
          })),
          answers: answers.map((answer) => {
            return new FormAnswerBrowseModel({
              id: answer.answer_id,
              value: answer.answer_value || undefined,
              participantsAnswersId: answer.participants_answers_id || undefined,
              selectedOptionsIds: answer.selected_options || [],
            });
          }),
        });
      }
    });

    // Convert to final array structure
    return Object.values(groupsRecord).map(({ group, questionsRecord }) => {
      const questions = Object.values(questionsRecord);

      return new FormQuestionGroupWithAnswersBrowseModel({
        id: group.id,
        name: group.name,
        description: group.description,
        order: group.order,
        identifier: group.identifier,
        questions,
      });
    });
  }
}
