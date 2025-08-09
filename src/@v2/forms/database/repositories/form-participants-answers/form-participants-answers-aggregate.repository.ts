import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, StatusEnum } from '@prisma/client';
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
      answers: true,
    } satisfies Prisma.FormParticipantsAnswersFindFirstArgs['include'];

    return { include };
  }

  async create(params: IFormParticipantsAnswersAggregateRepository.CreateParams): IFormParticipantsAnswersAggregateRepository.CreateReturn {
    const participantsAnswers = await this.prisma.$transaction(async (tx) => {
      const participantsAnswers = await tx.formParticipantsAnswers.create({
        data: {
          form_application_id: params.application.id,
          employee_id: undefined,
          status: StatusEnum[params.status],
        },
      });

      await Promise.all(
        params.answers.map(async (answer) => {
          return await tx.formAnswer.create({
            data: {
              question_id: answer.questionId,
              value: answer.value,
              option_id: answer.optionId,
              participants_answers_id: participantsAnswers.id,
            },
          });
        }),
      );

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
