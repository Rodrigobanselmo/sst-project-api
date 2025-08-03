import { FormIdentifierTypeEnum } from '@/@v2/forms/domain/enums/form-identifier-type.enum';
import { FormQuestionTypeEnum } from '@/@v2/forms/domain/enums/form-question-type.enum';
import { FormTypeEnum } from '@/@v2/forms/domain/enums/form-type.enum';
import { FormApplicationReadPublicModel } from '@/@v2/forms/domain/models/form-application/form-application-read-public.model';
import { FormQuestionDetailsReadModel } from '@/@v2/forms/domain/models/shared/form-question-details-read.model';
import { FormQuestionGroupReadModel } from '@/@v2/forms/domain/models/shared/form-question-group-read.model';
import { FormQuestionOptionReadModel } from '@/@v2/forms/domain/models/shared/form-question-option-read.model';
import { FormQuestionReadModel } from '@/@v2/forms/domain/models/shared/form-question-read.model';
import { Form as PrismaForm, FormApplication as PrismaFormApplication, FormIdentifierTypeEnum as PrismaFormIdentifierTypeEnum, FormQuestionGroup as PrismaFormQuestionGroup } from '@prisma/client';

export type IFormApplicationReadPublicModelMapper = PrismaFormApplication & {
  form: PrismaForm & {
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
  question_identifier_group: (PrismaFormQuestionGroup & {
    data: {
      id: string;
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
          question_identifier: {
            type: PrismaFormIdentifierTypeEnum;
          };
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
  })[];
};

export class FormApplicationReadPublicModelMapper {
  static toModel(prisma: IFormApplicationReadPublicModelMapper): FormApplicationReadPublicModel {
    if (!prisma.question_identifier_group[0]) throw new Error('Missing question identifier group');

    // Map form question groups
    const formQuestionGroups = prisma.form.questions_groups.map((group) => {
      const groupData = group.data[0]!;

      return new FormQuestionGroupReadModel({
        id: group.id,
        name: groupData.name,
        description: groupData.description,
        order: groupData.order,
        questions: group.questions.map((question) => {
          const questionData = question.data[0]!;
          const questionDetailsData = question.question_details.data[0]!;

          return new FormQuestionReadModel({
            id: question.id,
            required: questionData.required,
            order: questionData.order,
            details: new FormQuestionDetailsReadModel({
              id: question.question_details.id,
              text: questionDetailsData.text,
              type: FormQuestionTypeEnum[questionDetailsData.type],
              acceptOther: questionDetailsData.accept_other,
              system: question.question_details.system,
              companyId: question.question_details.company_id || undefined,
            }),
            options: question.question_details.options.map((option) => {
              const optionData = option.data[0]!;
              return new FormQuestionOptionReadModel({
                id: option.id,
                text: optionData.text,
                value: optionData.value,
                order: optionData.order,
              });
            }),
          });
        }),
      });
    });

    // Map question identifier group
    const questionIdentifierGroup = new FormQuestionGroupReadModel({
      id: prisma.question_identifier_group[0].id,
      name: prisma.question_identifier_group[0].data[0].name,
      description: prisma.question_identifier_group[0].data[0].description || undefined,
      order: prisma.question_identifier_group[0].data[0].order,
      questions: prisma.question_identifier_group[0].questions.map((question) => {
        const questionData = question.data[0]!;
        const questionDetailsData = question.question_details.data[0]!;

        if (!questionDetailsData.question_identifier) {
          throw new Error('Missing question identifier on question details');
        }

        return new FormQuestionReadModel({
          id: question.id,
          required: questionData.required,
          order: questionData.order,
          details: new FormQuestionDetailsReadModel({
            id: question.question_details.id,
            text: questionDetailsData.text,
            type: FormQuestionTypeEnum[questionDetailsData.type],
            identifierType: FormIdentifierTypeEnum[questionDetailsData.question_identifier.type],
            acceptOther: questionDetailsData.accept_other,
            system: question.question_details.system,
            companyId: question.question_details.company_id || undefined,
          }),
          options: question.question_details.options.map((option) => {
            const optionData = option.data[0]!;
            return new FormQuestionOptionReadModel({
              id: option.id,
              text: optionData.text,
              value: optionData.value,
              order: optionData.order,
            });
          }),
        });
      }),
    });

    return new FormApplicationReadPublicModel({
      id: prisma.id,
      name: prisma.name,
      description: prisma.description,
      form: {
        name: prisma.form.name,
        type: FormTypeEnum[prisma.form.type],
        questionGroups: formQuestionGroups,
      },
      questionIdentifierGroup,
    });
  }

  static toModels(prisma: IFormApplicationReadPublicModelMapper[]): FormApplicationReadPublicModel[] {
    return prisma.map((rec) => FormApplicationReadPublicModelMapper.toModel(rec));
  }
}
