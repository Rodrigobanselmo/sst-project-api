import { FormStatusEnum } from '@/@v2/forms/domain/enums/form-status.enum';
import { FormQuestionTypeEnum } from '@/@v2/forms/domain/enums/form-question-type.enum';
import { FormApplicationReadModel } from '@/@v2/forms/domain/models/form-application/form-application-read.model';
import { FormQuestionDetailsReadModel } from '@/@v2/forms/domain/models/shared/form-question-details-read.model';
import { FormQuestionGroupReadModel } from '@/@v2/forms/domain/models/shared/form-question-group-read.model';
import { FormQuestionOptionReadModel } from '@/@v2/forms/domain/models/shared/form-question-option-read.model';
import { FormQuestionReadModel } from '@/@v2/forms/domain/models/shared/form-question-read.model';
import {
  FormApplication as PrismaFormApplication,
  FormParticipantsWorkspace as PrismaFormParticipantsWorkspace,
  FormParticipantsHierarchy as PrismaFormParticipantsHierarchy,
  Form as PrismaForm,
  FormParticipants as PrismaFormParticipants,
  FormQuestionGroup as PrismaFormQuestionGroup,
  FormIdentifierTypeEnum as PrismaFormIdentifierTypeEnum,
} from '@prisma/client';
import { FormIdentifierTypeEnum } from '@/@v2/forms/domain/enums/form-identifier-type.enum';
import { FormTypeEnum } from '@/@v2/forms/domain/enums/form-type.enum';

export type IFormApplicationReadModelMapper = PrismaFormApplication & {
  form: PrismaForm;
  totalParticipants: number;
  totalAnswers: number;
  averageTimeSpent: number | null;
  participants:
    | (PrismaFormParticipants & {
        hierarchies: (PrismaFormParticipantsHierarchy & { hierarchy: { id: string; name: string } })[];
        workspaces: (PrismaFormParticipantsWorkspace & { workspaces: { id: string; name: string } })[];
      })
    | null;
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

export class FormApplicationReadModelMapper {
  static toModel(prisma: IFormApplicationReadModelMapper): FormApplicationReadModel {
    if (!prisma.question_identifier_group[0]) throw new Error('Missing question identifier group');

    return new FormApplicationReadModel({
      id: prisma.id,
      name: prisma.name,
      companyId: prisma.company_id,
      description: prisma.description || undefined,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
      startedAt: prisma.started_at,
      endedAt: prisma.ended_at,
      status: FormStatusEnum[prisma.status],
      isShareableLink: prisma.form.shareable_link,
      isAnonymous: prisma.form.anonymous,
      form: {
        id: prisma.form.id,
        name: prisma.form.name,
        type: FormTypeEnum[prisma.form.type],
      },
      totalParticipants: prisma.totalParticipants,
      totalAnswers: prisma.totalAnswers,
      averageTimeSpent: prisma.averageTimeSpent,
      participants: prisma.participants
        ? {
            hierarchies: prisma.participants.hierarchies.map((h) => ({
              id: h.hierarchy.id,
              name: h.hierarchy.name,
            })),
            workspaces: prisma.participants.workspaces.map((w) => ({
              id: w.workspaces.id,
              name: w.workspaces.name,
            })),
          }
        : {
            hierarchies: [],
            workspaces: [],
          },
      questionIdentifierGroup: new FormQuestionGroupReadModel({
        id: prisma.question_identifier_group[0].id,
        name: prisma.question_identifier_group[0].data[0]?.name || '',
        description: prisma.question_identifier_group[0].data[0]?.description || undefined,
        order: prisma.question_identifier_group[0].data[0]?.order || 0,
        questions: prisma.question_identifier_group[0].questions.map((question) => {
          const questionData = question.data[0]!; // Get the latest data
          const questionDetailsData = question.question_details.data[0]!; // Get the latest data

          if (!questionDetailsData.question_identifier) {
            throw new Error('Missing question identifier on question details');
          }

          return new FormQuestionReadModel({
            id: question.id,
            required: questionData?.required || false,
            order: questionData?.order || 0,
            details: new FormQuestionDetailsReadModel({
              id: question.question_details.id,
              text: questionDetailsData.text || '',
              type: FormQuestionTypeEnum[questionDetailsData.type],
              identifierType: FormIdentifierTypeEnum[questionDetailsData.question_identifier.type],
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
      }),
    });
  }

  static toModels(prisma: IFormApplicationReadModelMapper[]): FormApplicationReadModel[] {
    return prisma.map((rec) => FormApplicationReadModelMapper.toModel(rec));
  }
}
