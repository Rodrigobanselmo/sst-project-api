import { FormApplicationAggregateRepository } from '@/@v2/forms/database/repositories/form-application/form-application-aggregate.repository';
import { FormQuestionIdentifierEntityRepository } from '@/@v2/forms/database/repositories/form-question-identifier/form-question-identifier.repository';
import { FormRepository } from '@/@v2/forms/database/repositories/form/form.repository';
import { FormApplicationAggregate } from '@/@v2/forms/domain/aggregates/form-application.aggregate';
import { FormParticipantsAggregate } from '@/@v2/forms/domain/aggregates/form-participants.aggregate';
import { FormQuestionIdentifierGroupAggregate } from '@/@v2/forms/domain/aggregates/form-question-identifier-group.aggregate';
import { FormQuestionAggregate } from '@/@v2/forms/domain/aggregates/form-question.aggregate';
import { FormApplicationEntity } from '@/@v2/forms/domain/entities/form-application.entity';
import { FormParticipantsEntity } from '@/@v2/forms/domain/entities/form-participants.entity';
import { FormParticipantsHierarchyEntity } from '@/@v2/forms/domain/entities/form-participants-hierarchy.entity';
import { FormParticipantsWorkspaceEntity } from '@/@v2/forms/domain/entities/form-participants-workspace.entity';
import { FormQuestionGroupEntity } from '@/@v2/forms/domain/entities/form-question-group.entity';
import { FormQuestionEntity } from '@/@v2/forms/domain/entities/form-question.entity';
import { FormQuestionDetailsFactory } from '@/@v2/forms/domain/factories/form-question-details.factory';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IAddFormApplicationUseCase } from './add-form-application.types';
import { FormQuestionOptionEntity } from '@/@v2/forms/domain/entities/form-question-option.entity';

@Injectable()
export class AddFormApplicationUseCase {
  constructor(
    private readonly formApplicationAggregateRepository: FormApplicationAggregateRepository,
    private readonly formQuestionIdentifierEntityRepository: FormQuestionIdentifierEntityRepository,
    private readonly formRepository: FormRepository,
  ) {}

  async execute(params: IAddFormApplicationUseCase.Params) {
    const form = await this.formRepository.find({ id: params.formId, companyId: params.companyId });
    if (!form) throw new BadRequestException('Formulário não encontrado');

    if (params.hierarchyIds.length === 0 && params.workspaceIds.length === 0) {
      throw new BadRequestException('É necessário informar pelo menos um estabelecimento ou setor');
    }

    const formApplication = new FormApplicationEntity({
      name: params.name,
      description: params.description,
      companyId: params.companyId,
    });

    const participantsHierarchies = params.hierarchyIds.map((hierarchyId) => {
      return new FormParticipantsHierarchyEntity({
        hierarchyId,
      });
    });

    const participantsWorkspaces = params.workspaceIds.map((workspaceId) => {
      return new FormParticipantsWorkspaceEntity({
        workspaceId,
      });
    });

    const questionGroup = new FormQuestionGroupEntity({
      order: 0,
      name: params.identifier.name,
      description: params.identifier.description,
    });

    const questionIdentifiers = await asyncBatch({
      items: params.identifier.questions,
      batchSize: 10,
      callback: async (question, index) => {
        const questionEntity = new FormQuestionEntity({
          order: index,
          required: question.required,
          groupId: questionGroup.id,
        });

        const identifierEntity = await this.formQuestionIdentifierEntityRepository.find({ type: question.details.identifierType });
        if (!identifierEntity) throw new BadRequestException('Tipo  de pergunta não encontrada');

        const detailsEntity = FormQuestionDetailsFactory.createFromIdentifierType({
          text: question.details.text,
          identifierType: question.details.identifierType,
          companyId: params.companyId,
          acceptOther: question.details.acceptOther,
        });

        const optionsEntities: FormQuestionOptionEntity[] = [];
        if (detailsEntity.needsOptions) {
          question.options?.forEach((option, optionIndex) => {
            const optionEntity = new FormQuestionOptionEntity({
              text: option.text,
              order: optionIndex,
              value: option.value,
            });

            optionsEntities.push(optionEntity);
          });
        }

        return new FormQuestionAggregate({
          question: questionEntity,
          identifier: identifierEntity,
          details: detailsEntity,
          options: optionsEntities,
        });
      },
    });

    const questionIdentifierGroup = new FormQuestionIdentifierGroupAggregate({
      questionGroup: questionGroup,
      questions: questionIdentifiers,
      formApplication,
    });

    const formParticipants = new FormParticipantsEntity({});

    const participantsAggregate = new FormParticipantsAggregate({
      formParticipants,
      participantsHierarchies,
      participantsWorkspaces,
    });

    const formApplicationAggregate = new FormApplicationAggregate({
      form,
      formApplication,
      participants: participantsAggregate,
      identifier: questionIdentifierGroup,
    });

    await this.formApplicationAggregateRepository.create(formApplicationAggregate);
  }
}
