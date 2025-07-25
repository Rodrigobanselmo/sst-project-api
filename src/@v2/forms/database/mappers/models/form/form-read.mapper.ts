import { FormQuestionTypeEnum } from '@/@v2/forms/domain/enums/form-question-type.enum';
import { FormTypeEnum } from '@/@v2/forms/domain/enums/form-type.enum';
import { FormQuestionDetailsReadModel } from '@/@v2/forms/domain/models/form/components/form-question-details-read.model';
import { FormQuestionGroupReadModel } from '@/@v2/forms/domain/models/form/components/form-question-group-read.model';
import { FormQuestionOptionReadModel } from '@/@v2/forms/domain/models/form/components/form-question-option-read.model';
import { FormQuestionReadModel } from '@/@v2/forms/domain/models/form/components/form-question-read.model';
import { FormReadModel } from '@/@v2/forms/domain/models/form/form-read.model';
import { Form } from '@prisma/client';

export type IFormReadModelMapper = Form & {
  questions_groups: {
    id: string;
    data: {
      name: string;
      description: string | null;
      order: number;
    }[];
    questions: {
      id: string;
      data: {
        required: boolean;
        order: number;
      }[];
      question_details: {
        id: string;
        system: boolean;
        company_id: string | null;
        data: {
          text: string;
          type: string;
          accept_other: boolean;
        }[];
        options: {
          id: string;
          data: {
            text: string;
            order: number;
            value: number | null;
          }[];
        }[];
      };
    }[];
  }[];
};

export class FormReadModelMapper {
  static toModel(prisma: IFormReadModelMapper): FormReadModel {
    return new FormReadModel({
      id: prisma.id,
      name: prisma.name,
      companyId: prisma.company_id,
      description: prisma.description || undefined,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
      anonymous: prisma.anonymous,
      system: prisma.system,
      shareable_link: prisma.shareable_link,
      type: FormTypeEnum[prisma.type],
      questionGroups: prisma.questions_groups.map((group) => {
        const groupData = group.data[0]; // Get the latest data
        return new FormQuestionGroupReadModel({
          id: group.id,
          name: groupData?.name || '',
          description: groupData?.description || undefined,
          order: groupData?.order || 0,
          questions: group.questions.map((question) => {
            const questionData = question.data[0]!; // Get the latest data
            const questionDetailsData = question.question_details.data[0]!; // Get the latest data

            return new FormQuestionReadModel({
              id: question.id,
              required: questionData?.required || false,
              order: questionData?.order || 0,
              details: new FormQuestionDetailsReadModel({
                id: question.question_details.id,
                text: questionDetailsData.text || '',
                type: FormQuestionTypeEnum[questionDetailsData.type],
                acceptOther: questionDetailsData?.accept_other || false,
                system: question.question_details.system,
                companyId: question.question_details.company_id || undefined,
              }),
              options: question.question_details.options.map((option) => {
                const optionData = option.data[0]; // Get the latest data
                return new FormQuestionOptionReadModel({
                  id: option.id,
                  text: optionData?.text || '',
                  value: optionData?.value || undefined,
                  order: optionData?.order || 0,
                });
              }),
            });
          }),
        });
      }),
    });
  }

  static toModels(prisma: IFormReadModelMapper[]): FormReadModel[] {
    return prisma.map((rec) => FormReadModelMapper.toModel(rec));
  }
}
