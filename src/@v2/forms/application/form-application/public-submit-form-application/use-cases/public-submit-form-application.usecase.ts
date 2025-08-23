import { FormApplicationRepository } from '@/@v2/forms/database/repositories/form-application/form-application.repository';
import { FormParticipantsAnswersAggregateRepository } from '@/@v2/forms/database/repositories/form-participants-answers/form-participants-answers-aggregate.repository';
import { FormParticipantsAggregateRepository } from '@/@v2/forms/database/repositories/form-participants/form-participants-aggregate.repository';
import { FormParticipantsAnswersAggregate } from '@/@v2/forms/domain/aggregates/form-participant-answers.aggregate';
import { FormAnswerEntity } from '@/@v2/forms/domain/entities/form-answer.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ISubmitFormApplicationUseCase } from './public-form-application.types';

@Injectable()
export class SubmitFormApplicationUseCase {
  constructor(
    private readonly formParticipantsAnswersAggregateRepository: FormParticipantsAnswersAggregateRepository,
    private readonly formApplicationRepository: FormApplicationRepository,
    private readonly formParticipantsAggregateRepository: FormParticipantsAggregateRepository,
  ) {}

  async execute(params: ISubmitFormApplicationUseCase.Params) {
    const formApplication = await this.formApplicationRepository.find({
      id: params.applicationId,
      companyId: undefined,
    });

    if (!formApplication) {
      throw new NotFoundException('Formulário não encontrado');
    }

    const participantAggregate = await this.formParticipantsAggregateRepository.findByFormApplicationId({
      formApplicationId: params.applicationId,
      companyId: formApplication.companyId,
    });

    if (!participantAggregate) {
      throw new NotFoundException('Formulário e participante não encontrado');
    }

    const answerEntities = (() => {
      try {
        return params.answers.map(
          (answer) =>
            new FormAnswerEntity({
              questionId: answer.questionId,
              value: answer.value,
              optionIds: answer.optionIds,
            }),
        );
      } catch (error) {
        throw new BadRequestException('Nenhum valor foi informado para a resposta');
      }
    })();

    const formParticipantsAnswersAggregate = new FormParticipantsAnswersAggregate({
      application: formApplication,
      participant: participantAggregate,
      answers: answerEntities,
      timeSpent: params.timeSpent,
    });

    await this.formParticipantsAnswersAggregateRepository.create(formParticipantsAnswersAggregate);
  }
}
