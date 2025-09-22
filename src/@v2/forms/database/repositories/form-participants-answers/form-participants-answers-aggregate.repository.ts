import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, StatusEnum } from '@prisma/client';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';
import { FormParticipantsAnswersAggregateMapper } from '../../mappers/aggregates/form-participant-answers-aggregate.mapper';
import { IFormParticipantsAnswersAggregateRepository } from './form-participants-answers-aggregate.repository.types';

@Injectable()
export class FormParticipantsAnswersAggregateRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {
      form_application: {
        include: {
          participants: {
            include: {
              hierarchies: true,
              workspaces: true,
            },
          },
        },
      },
      answers: {
        include: {
          options: true,
        },
      },
    } satisfies Prisma.FormParticipantsAnswersFindFirstArgs['include'];

    return { include };
  }

  async create(params: IFormParticipantsAnswersAggregateRepository.CreateParams): IFormParticipantsAnswersAggregateRepository.CreateReturn {
    const participantsAnswers = await this.prisma.$transaction(async (tx) => {
      const participantsAnswers = await tx.formParticipantsAnswers.create({
        data: {
          form_application_id: params.application.id,
          employee_id: params.employeeId,
          status: StatusEnum[params.status],
          time_spent: params.timeSpent,
        },
      });

      await asyncBatch({
        items: params.answers,
        batchSize: 10,
        callback: async (answer) => {
          const createdAnswer = await tx.formAnswer.create({
            data: {
              question_id: answer.questionId,
              value: answer.value,
              participants_answers_id: participantsAnswers.id,
            },
          });

          // Create FormAnswerOption entries for each selected option
          if (answer.optionIds && answer.optionIds.length > 0) {
            await asyncBatch({
              items: answer.optionIds,
              batchSize: 5,
              callback: async (optionId) => {
                return await tx.formAnswerOption.create({
                  data: {
                    answer_id: createdAnswer.id,
                    option_id: optionId,
                  },
                });
              },
            });
          }

          return createdAnswer;
        },
      });

      return participantsAnswers;
    });

    return !!participantsAnswers?.id;
  }

  async find(params: IFormParticipantsAnswersAggregateRepository.FindParams): IFormParticipantsAnswersAggregateRepository.FindReturn {
    const participantsAnswers = await this.prisma.formParticipantsAnswers.findFirst({
      where: {
        id: params.id,
        form_application: {
          company_id: params.companyId,
        },
      },
      ...FormParticipantsAnswersAggregateRepository.selectOptions(),
    });

    return participantsAnswers ? FormParticipantsAnswersAggregateMapper.toAggregate(participantsAnswers) : null;
  }

  async findMany(params: IFormParticipantsAnswersAggregateRepository.FindManyParams): IFormParticipantsAnswersAggregateRepository.FindManyReturn {
    const participantsAnswers = await this.prisma.formParticipantsAnswers.findMany({
      where: {
        form_application_id: params.formApplicationId,
        form_application: {
          company_id: params.companyId,
        },
      },
      ...FormParticipantsAnswersAggregateRepository.selectOptions(),
    });

    return FormParticipantsAnswersAggregateMapper.toArray(participantsAnswers);
  }
}
