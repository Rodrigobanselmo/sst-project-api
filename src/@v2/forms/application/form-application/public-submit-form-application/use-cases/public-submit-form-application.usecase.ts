import { FormApplicationRepository } from '@/@v2/forms/database/repositories/form-application/form-application.repository';
import { FormParticipantsAnswersRepository } from '@/@v2/forms/database/repositories/form-participants-answers/form-participants-answers.repository';
import { FormParticipantsAnswersAggregate } from '@/@v2/forms/domain/aggregates/form-participant-answers.aggregate';
import { FormAnswerEntity } from '@/@v2/forms/domain/entities/form-answer.entity';
import { FormParticipantsEntity } from '@/@v2/forms/domain/entities/form-participants.entity';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ISubmitFormApplicationUseCase } from './public-form-application.types';

@Injectable()
export class SubmitFormApplicationUseCase {
  constructor(
    private readonly formParticipantsAnswersRepository: FormParticipantsAnswersRepository,
    private readonly formApplicationRepository: FormApplicationRepository,
    private readonly prisma: PrismaServiceV2,
  ) {}

  async execute(params: ISubmitFormApplicationUseCase.Params) {
    const formApplication = await this.formApplicationRepository.find({
      id: params.applicationId,
      companyId: undefined,
    });

    if (!formApplication) {
      throw new NotFoundException('Formulário não encontrado');
    }

    const answerEntities = params.answers.map(
      (answer) =>
        new FormAnswerEntity({
          questionId: answer.questionId,
          value: answer.value,
          optionId: answer.optionId,
        }),
    );

    const participant = new FormParticipantsEntity({});

    const formParticipantsAnswersAggregate = new FormParticipantsAnswersAggregate({
      application: formApplication,
      participant: participant,
      answers: answerEntities,
    });

    await this.formParticipantsAnswersRepository.create(formParticipantsAnswersAggregate);
  }
}
