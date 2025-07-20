import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FormAggregateMapper } from '../../mappers/aggregates/form-aggregate.mapper';
import { FormAggregate } from '@/@v2/forms/domain/aggregates/form.aggregate';
import { IFormAggregateRepository } from './form-aggregate.types';

@Injectable()
export class FormAggregateRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {
      questions_groups: {
        where: {
          deleted_at: null,
        },
        orderBy: {
          order: 'asc',
        },
        include: {
          questions: {
            where: {
              deleted_at: null,
            },
            orderBy: {
              order: 'asc',
            },
            include: {
              question_data: {
                include: {
                  options: {
                    orderBy: {
                      order: 'asc',
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
            name: questionGroup.name,
            description: questionGroup.description,
            order: questionGroup.order,
            form_id: form.id,
          },
        });

        for (const question of questionGroup.questions) {
          const createdQuestionData = await tx.formQuestionData.create({
            data: {
              text: question.data.text,
              type: question.data.type,
              accept_other: question.data.acceptOther,
              system: question.data.system,
              company_id: question.data.companyId,
            },
          });

          for (const option of question.options) {
            await tx.formQuestionOption.create({
              data: {
                text: option.text,
                order: option.order,
                value: option.value,
                question_id: createdQuestionData.id,
              },
            });
          }

          await tx.formQuestion.create({
            data: {
              required: question.required,
              order: question.order,
              question_data_id: createdQuestionData.id,
              question_group_id: createdGroup.id,
            },
          });
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

  async update(params: IFormAggregateRepository.UpdateParams): IFormAggregateRepository.UpdateReturn {
    const formAggregate = await this.prisma.$transaction(async (tx) => {
      // Update the form
      await tx.form.update({
        where: {
          id: params.form.id,
          company_id: params.form.companyId,
        },
        data: {
          name: params.form.name,
          type: params.form.type,
          description: params.form.description,
          anonymous: params.form.anonymous,
          shareable_link: params.form.shareableLink,
        },
      });

      // Get existing form structure for comparison
      const existingForm = await tx.form.findFirst({
        where: { id: params.form.id },
        include: {
          questions_groups: {
            where: { deleted_at: null },
            include: {
              questions: {
                where: { deleted_at: null },
                include: {
                  question_data: {
                    include: {
                      options: {
                        where: { deleted_at: null },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!existingForm) {
        throw new Error('Form not found');
      }

      // Compare and update question groups
      const existingGroups = existingForm.questions_groups;
      const newGroups = params.questionGroups;

      // Soft delete groups that no longer exist
      for (const existingGroup of existingGroups) {
        const groupStillExists = newGroups.some((newGroup, index) => newGroup.name === existingGroup.name && newGroup.description === existingGroup.description && index + 1 === existingGroup.order);

        if (!groupStillExists) {
          await tx.formQuestionGroup.update({
            where: { id: existingGroup.id },
            data: { deleted_at: new Date() },
          });
        }
      }

      // Update or create question groups
      for (let groupIndex = 0; groupIndex < newGroups.length; groupIndex++) {
        const newGroup = newGroups[groupIndex];
        const existingGroup = existingGroups.find((eg) => eg.name === newGroup.name && eg.description === newGroup.description && eg.order === groupIndex + 1);

        let groupId: number;

        if (existingGroup) {
          // Update existing group
          await tx.formQuestionGroup.update({
            where: { id: existingGroup.id },
            data: {
              name: newGroup.name,
              description: newGroup.description,
              order: groupIndex + 1,
            },
          });
          groupId = existingGroup.id;
        } else {
          // Create new group
          const createdGroup = await tx.formQuestionGroup.create({
            data: {
              name: newGroup.name,
              description: newGroup.description,
              order: groupIndex + 1,
              form_id: params.form.id,
            },
          });
          groupId = createdGroup.id;
        }

        // Handle questions within this group
        const existingQuestions = existingGroup?.questions || [];

        // Soft delete questions that no longer exist in this group
        for (const existingQuestion of existingQuestions) {
          const questionStillExists = newGroup.questions.some(
            (newQuestion, qIndex) =>
              newQuestion.data.text === existingQuestion.question_data.text &&
              newQuestion.data.type === existingQuestion.question_data.type &&
              newQuestion.required === existingQuestion.required &&
              qIndex + 1 === existingQuestion.order,
          );

          if (!questionStillExists) {
            await tx.formQuestion.update({
              where: { id: existingQuestion.id },
              data: { deleted_at: new Date() },
            });
          }
        }

        // Update or create questions
        for (let questionIndex = 0; questionIndex < newGroup.questions.length; questionIndex++) {
          const newQuestion = newGroup.questions[questionIndex];
          const existingQuestion = existingQuestions.find(
            (eq) => eq.question_data.text === newQuestion.data.text && eq.question_data.type === newQuestion.data.type && eq.required === newQuestion.required && eq.order === questionIndex + 1,
          );

          let questionDataId: number;

          if (existingQuestion) {
            // Update existing question data
            await tx.formQuestionData.update({
              where: { id: existingQuestion.question_data_id },
              data: {
                text: newQuestion.data.text,
                type: newQuestion.data.type,
                accept_other: newQuestion.data.acceptOther,
              },
            });
            questionDataId = existingQuestion.question_data_id;

            // Update question
            await tx.formQuestion.update({
              where: { id: existingQuestion.id },
              data: {
                required: newQuestion.required,
                order: questionIndex + 1,
              },
            });
          } else {
            // Create new question data
            const createdQuestionData = await tx.formQuestionData.create({
              data: {
                text: newQuestion.data.text,
                type: newQuestion.data.type,
                accept_other: newQuestion.data.acceptOther,
                system: newQuestion.data.system,
                company_id: newQuestion.data.companyId,
              },
            });
            questionDataId = createdQuestionData.id;

            // Create new question
            await tx.formQuestion.create({
              data: {
                required: newQuestion.required,
                order: questionIndex + 1,
                question_data_id: questionDataId,
                question_group_id: groupId,
              },
            });
          }

          // Handle options for this question
          if (newQuestion.data.needsOptions) {
            const existingOptions = existingQuestion?.question_data.options || [];

            // Soft delete options that no longer exist
            for (const existingOption of existingOptions) {
              const optionStillExists = newQuestion.options?.some(
                (newOption, oIndex) => newOption.text === existingOption.text && newOption.value === existingOption.value && oIndex + 1 === existingOption.order,
              );

              if (!optionStillExists) {
                await tx.formQuestionOption.update({
                  where: { id: existingOption.id },
                  data: { deleted_at: new Date() },
                });
              }
            }

            // Update or create options
            if (newQuestion.options) {
              for (let optionIndex = 0; optionIndex < newQuestion.options.length; optionIndex++) {
                const newOption = newQuestion.options[optionIndex];
                const existingOption = existingOptions.find((eo) => eo.text === newOption.text && eo.value === newOption.value && eo.order === optionIndex + 1);

                if (existingOption) {
                  // Update existing option
                  await tx.formQuestionOption.update({
                    where: { id: existingOption.id },
                    data: {
                      text: newOption.text,
                      order: optionIndex + 1,
                      value: newOption.value,
                    },
                  });
                } else {
                  // Create new option
                  await tx.formQuestionOption.create({
                    data: {
                      text: newOption.text,
                      order: optionIndex + 1,
                      value: newOption.value,
                      question_id: questionDataId,
                    },
                  });
                }
              }
            }
          }
        }
      }

      // Fetch the complete form with all relations
      const completeForm = await tx.form.findFirst({
        where: { id: params.form.id },
        ...FormAggregateRepository.selectOptions(),
      });

      return completeForm;
    });

    return formAggregate ? FormAggregateMapper.toAggregate(formAggregate) : null;
  }
}
