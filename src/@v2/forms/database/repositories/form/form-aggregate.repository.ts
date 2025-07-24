import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FormAggregateMapper } from '../../mappers/aggregates/form-aggregate.mapper';
import { IFormAggregateRepository } from './form-aggregate.types';

@Injectable()
export class FormAggregateRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {
      questions_groups: {
        where: { deleted_at: null },
        include: {
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
        },
      },
    } satisfies Prisma.FormFindFirstArgs['include'];

    return { include };
  }

  async create(params: IFormAggregateRepository.CreateParams): IFormAggregateRepository.CreateReturn {
    const formAggregate = await this.prisma.$transaction(async (tx) => {
      const form = await tx.form.create({
        data: {
          name: params.form.name,
          company_id: params.form.companyId,
          type: params.form.type,
          description: params.form.description,
          anonymous: params.form.anonymous,
          shareable_link: params.form.shareableLink,
          system: params.form.system,
        },
      });

      for (const questionGroup of params.questionGroups) {
        const createdGroup = await tx.formQuestionGroup.create({
          data: {
            form_id: form.id,
          },
        });

        // Create the group data
        await tx.formQuestionGroupData.create({
          data: {
            name: questionGroup?.name || '',
            description: questionGroup?.description,
            order: questionGroup?.order || 0,
            form_question_group_id: createdGroup.id,
          },
        });

        for (const question of questionGroup.questions) {
          // Create FormQuestionDetails first
          const createdQuestionDetails = await tx.formQuestionDetails.create({
            data: {
              system: question.details.system,
              company_id: question.details.companyId,
            },
          });

          // Create FormQuestionDetailsData
          await tx.formQuestionDetailsData.create({
            data: {
              text: question.details.text,
              type: question.details.type,
              accept_other: question.details.acceptOther,
              form_question_details_id: createdQuestionDetails.id,
            },
          });

          // Create FormQuestion
          const createdQuestion = await tx.formQuestion.create({
            data: {
              question_details_id: createdQuestionDetails.id,
              question_group_id: createdGroup.id,
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
          for (const option of question.options) {
            const createdOption = await tx.formQuestionOption.create({
              data: {
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
      }

      const completeForm = await tx.form.findFirst({
        where: { id: form.id },
        ...FormAggregateRepository.selectOptions(),
      });

      return completeForm;
    });

    return formAggregate ? FormAggregateMapper.toAggregate(formAggregate) : null;
  }

  async find(params: IFormAggregateRepository.FindParams): IFormAggregateRepository.FindReturn {
    const formAggregate = await this.prisma.form.findFirst({
      where: {
        id: params.id,
        OR: [
          {
            company_id: params.companyId,
          },
          {
            system: true,
          },
        ],
      },
      ...FormAggregateRepository.selectOptions(),
    });

    return formAggregate ? FormAggregateMapper.toAggregate(formAggregate) : null;
  }

  async update(aggregate: IFormAggregateRepository.UpdateParams): IFormAggregateRepository.UpdateReturn {
    const formAggregate = await this.prisma.$transaction(async (tx) => {
      await tx.form.update({
        where: {
          id: aggregate.form.id,
          company_id: aggregate.form.companyId,
        },
        data: {
          name: aggregate.form.name,
          type: aggregate.form.type,
          description: aggregate.form.description,
          anonymous: aggregate.form.anonymous,
          shareable_link: aggregate.form.shareableLink,
        },
      });

      for (const questionGroup of aggregate.questionGroups) {
        if (questionGroup.deletedAt) {
          // Soft delete the entire group and all its children
          await tx.formQuestionGroup.update({
            where: { id: questionGroup.id },
            data: { deleted_at: new Date() },
          });
          continue;
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

        for (const question of questionGroup.questions) {
          if (question.deletedAt) {
            await tx.formQuestion.update({
              where: { id: question.id },
              data: { deleted_at: new Date() },
            });
            continue;
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

          if (question.details.diff().hasChanges) {
            await tx.formQuestionDetailsData.updateMany({
              where: { form_question_details_id: question.details.id, deleted_at: null },
              data: { deleted_at: new Date() },
            });

            await tx.formQuestionDetailsData.create({
              data: {
                text: question.details.text,
                type: question.details.type,
                accept_other: question.details.acceptOther,
                form_question_details_id: question.details.id,
              },
            });
          }

          for (const option of question.options) {
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

      const completeForm = await tx.form.findFirst({
        where: { id: aggregate.form.id },
        ...FormAggregateRepository.selectOptions(),
      });

      return completeForm;
    });

    return formAggregate ? FormAggregateMapper.toAggregate(formAggregate) : null;
  }
}
