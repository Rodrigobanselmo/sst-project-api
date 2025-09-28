import { FormApplicationRepository } from '@/@v2/forms/database/repositories/form-application/form-application.repository';
import { FormParticipantsAnswersAggregateRepository } from '@/@v2/forms/database/repositories/form-participants-answers/form-participants-answers-aggregate.repository';
import { FormParticipantsAggregateRepository } from '@/@v2/forms/database/repositories/form-participants/form-participants-aggregate.repository';
import { FormParticipantsAnswersAggregate } from '@/@v2/forms/domain/aggregates/form-participant-answers.aggregate';
import { FormAnswerEntity } from '@/@v2/forms/domain/entities/form-answer.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ISubmitFormApplicationUseCase } from './public-form-application.types';
import { FormApplicationAggregateRepository } from '@/@v2/forms/database/repositories/form-application/form-application-aggregate.repository';

@Injectable()
export class SubmitFormApplicationUseCase {
  constructor(
    private readonly formParticipantsAnswersAggregateRepository: FormParticipantsAnswersAggregateRepository,
    private readonly formApplicationAggregateRepository: FormApplicationAggregateRepository,
    private readonly formParticipantsAggregateRepository: FormParticipantsAggregateRepository,
  ) {}

  async execute(params: ISubmitFormApplicationUseCase.Params) {
    const formApplication = await this.formApplicationAggregateRepository.find({
      id: params.applicationId,
      companyId: undefined,
    });

    if (!formApplication) {
      throw new NotFoundException('Formulário não encontrado');
    }

    // Validate if form is shareable - if not, employeeId is required
    // Exception: when form is in testing mode, allow submission without employeeId
    if (!formApplication.isShareableLink && !formApplication.formApplication.isTesting) {
      if (!params.employeeId) {
        throw new BadRequestException('Este formulário requer identificação do funcionário');
      }
    }

    // Check if user has already answered this form
    if (params.employeeId) {
      const existingAnswer = await this.formParticipantsAnswersAggregateRepository.findByEmployeeAndFormApplication({
        formApplicationId: params.applicationId,
        employeeId: params.employeeId,
        companyId: formApplication.formApplication.companyId,
      });

      if (existingAnswer) {
        throw new BadRequestException('Você já respondeu este formulário');
      }
    }

    const participantAggregate = await this.formParticipantsAggregateRepository.findByFormApplicationId({
      formApplicationId: params.applicationId,
      companyId: formApplication.formApplication.companyId,
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
      application: formApplication.formApplication,
      participant: participantAggregate,
      answers: answerEntities,
      timeSpent: params.timeSpent,
      employeeId: params.employeeId,
    });

    await this.formParticipantsAnswersAggregateRepository.create(formParticipantsAnswersAggregate);
  }
}
