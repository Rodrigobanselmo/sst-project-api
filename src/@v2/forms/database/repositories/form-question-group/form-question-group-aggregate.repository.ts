import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FormQuestionAggregateRepository } from '../form-question/form-question-aggregate.repository';
import { IFormQuestionGroupAggregateRepository } from './form-question-group-aggregate.types';

@Injectable()
export class FormQuestionGroupAggregateRepository {
  constructor(
    private readonly prisma: PrismaServiceV2,
    private readonly formQuestionAggregateRepository: FormQuestionAggregateRepository,
  ) {}

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

  async createTx(params: IFormQuestionGroupAggregateRepository.CreateTxParams, tx: Prisma.TransactionClient) {
    const createdGroup = await tx.formQuestionGroup.create({
      data: {
        id: params.questionGroup.id,
        form_id: params.form.id,
      },
    });

    // Create the group data
    await tx.formQuestionGroupData.create({
      data: {
        name: params.questionGroup.name || '',
        description: params.questionGroup.description,
        order: params.questionGroup.order || 0,
        form_question_group_id: createdGroup.id,
      },
    });

    for (const questionEntity of params.questions) {
      await this.formQuestionAggregateRepository.createTx(questionEntity, tx);
    }
  }

  async upsertTx(params: IFormQuestionGroupAggregateRepository.UpsertTxParams, tx: Prisma.TransactionClient) {
    const { questionGroup, questions } = params;

    if (questionGroup.isNew) {
      await tx.formQuestionGroup.create({
        data: {
          id: questionGroup.id,
          form_id: params.form.id,
          data: {
            create: {
              name: questionGroup.name,
              description: questionGroup.description,
              order: questionGroup.order,
            },
          },
        },
      });
    }

    if (questionGroup.deletedAt) {
      await tx.formQuestionGroup.update({
        where: { id: questionGroup.id },
        data: { deleted_at: new Date() },
      });
      return;
    }

    if (questionGroup.diff().hasChanges) {
      await tx.formQuestionGroupData.updateMany({
        where: { form_question_group_id: questionGroup.id, deleted_at: null },
        data: { deleted_at: new Date() },
      });

      await tx.formQuestionGroupData.create({
        data: {
          name: questionGroup.name,
          description: questionGroup.description,
          order: questionGroup.order,
          form_question_group_id: questionGroup.id,
        },
      });
    }

    for (const questionEntity of questions) {
      await this.formQuestionAggregateRepository.upsertTx(questionEntity, tx);
    }
  }
}
