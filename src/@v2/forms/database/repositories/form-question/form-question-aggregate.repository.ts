import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IFormQuestionAggregateRepository } from './form-question-aggregate.types';

@Injectable()
export class FormQuestionAggregateRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {
      data: { where: { deleted_at: null } },
      questions: {
        where: { deleted_at: null },
        include: {
          data: { where: { deleted_at: null } },
          question_details: {
            include: {
              data: { where: { deleted_at: null } },
              options: {
                where: { deleted_at: null },
                include: {
                  data: { where: { deleted_at: null } },
                },
              },
            },
          },
        },
      },
    } satisfies Prisma.FormQuestionGroupFindFirstArgs['include'];

    return { include };
  }

  async createTx(params: IFormQuestionAggregateRepository.CreateTxParams, tx: Prisma.TransactionClient) {
    const { question, details, identifier, options } = params;

    // Create FormQuestionDetails first
    const createdQuestionDetails = await tx.formQuestionDetails.create({
      data: {
        id: details.id,
        system: details.system,
        company_id: details.companyId,
      },
    });

    // Create FormQuestionDetailsData
    await tx.formQuestionDetailsData.create({
      data: {
        text: details.text,
        type: details.type,
        accept_other: details.acceptOther,
        form_question_details_id: createdQuestionDetails.id,
        question_identifier_id: identifier?.id,
      },
    });

    // Create FormQuestion
    const createdQuestion = await tx.formQuestion.create({
      data: {
        id: question.id,
        question_details_id: createdQuestionDetails.id,
        question_group_id: question.groupId,
        question_identifier_group_id: question.identifierGroupId,
      },
    });

    // Create FormQuestionData for required/order
    await tx.formQuestionData.create({
      data: {
        required: question.required,
        order: question.order,
        form_question_id: createdQuestion.id,
      },
    });

    // Create options
    for (const option of options) {
      const createdOption = await tx.formQuestionOption.create({
        data: {
          id: option.id,
          question_id: createdQuestionDetails.id,
        },
      });

      await tx.formQuestionOptionData.create({
        data: {
          text: option.text,
          order: option.order,
          value: option.value,
          form_question_option_id: createdOption.id,
        },
      });
    }
  }

  async upsertTx(params: IFormQuestionAggregateRepository.UpsertTxParams, tx: Prisma.TransactionClient) {
    const { question, details, identifier, options } = params;

    if (question.isNew) {
      await tx.formQuestionDetails.create({
        data: {
          id: details.id,
          company_id: details.companyId,
          system: details.system,

          data: {
            create: {
              text: details.text,
              question_identifier_id: identifier?.id,
              type: details.type,
              accept_other: details.acceptOther,
            },
          },
        },
      });

      await tx.formQuestion.create({
        data: {
          question_group_id: question.groupId,
          question_identifier_group_id: question.identifierGroupId,
          question_details_id: details.id,
          data: {
            create: {
              required: question.required,
              order: question.order,
            },
          },
        },
      });
    }

    if (question.deletedAt) {
      await tx.formQuestion.update({
        where: { id: question.id },
        data: { deleted_at: new Date() },
      });
      return;
    }

    if (question.diff().hasChanges) {
      await tx.formQuestionData.updateMany({
        where: { form_question_id: question.id, deleted_at: null },
        data: { deleted_at: new Date() },
      });

      await tx.formQuestionData.create({
        data: {
          required: question.required,
          order: question.order,
          form_question_id: question.id,
        },
      });
    }

    if (details.diff().hasChanges) {
      await tx.formQuestionDetailsData.updateMany({
        where: { form_question_details_id: details.id, deleted_at: null },
        data: { deleted_at: new Date() },
      });

      await tx.formQuestionDetailsData.create({
        data: {
          text: details.text,
          type: details.type,
          accept_other: details.acceptOther,
          form_question_details_id: details.id,
          question_identifier_id: identifier?.id,
        },
      });
    }

    for (const option of options) {
      if (option.isNew) {
        await tx.formQuestionOption.create({
          data: {
            question_id: details.id,
            id: option.id,
            data: {
              create: {
                text: option.text,
                order: option.order,
                value: option.value,
              },
            },
          },
        });
      }

      if (option.deletedAt) {
        await tx.formQuestionOption.update({
          where: { id: option.id },
          data: { deleted_at: new Date() },
        });
        continue;
      }

      if (option.diff().hasChanges) {
        await tx.formQuestionOptionData.updateMany({
          where: { form_question_option_id: option.id, deleted_at: null },
          data: { deleted_at: new Date() },
        });

        await tx.formQuestionOptionData.create({
          data: {
            text: option.text,
            order: option.order,
            value: option.value,
            form_question_option_id: option.id,
          },
        });
      }
    }
  }
}
