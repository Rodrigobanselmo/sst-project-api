import { FormApplicationAggregateRepository } from '@/@v2/forms/database/repositories/form-application/form-application-aggregate.repository';
import { FormQuestionDataAggregateRepository } from '@/@v2/forms/database/repositories/Form-question-identifier/Form-question-identifier-data-aggregate.repository';
import { FormRepository } from '@/@v2/forms/database/repositories/form/form.repository';
import { FormApplicationAggregate } from '@/@v2/forms/domain/aggregates/form-application.aggregate';
import { FormQuestionIdentifierGroupAggregate } from '@/@v2/forms/domain/aggregates/form-question-identifier-group.aggregate';
import { FormQuestionIdentifierAggregate } from '@/@v2/forms/domain/aggregates/form-question-identifier.aggregate';
import { FormApplicationEntity } from '@/@v2/forms/domain/entities/form-application.entity';
import { FormParticipantsHierarchyEntity } from '@/@v2/forms/domain/entities/form-participants-hierarchy.entity';
import { FormParticipantsWorkspaceEntity } from '@/@v2/forms/domain/entities/form-participants-workspace.entity';
import { FormQuestionIdentifierGroupEntity } from '@/@v2/forms/domain/entities/form-question-identifier-group.entity';
import { FormQuestionEntity } from '@/@v2/forms/domain/entities/form-question.entity';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IAddFormApplicationUseCase } from './add-form-application.types';

@Injectable()
export class AddFormApplicationUseCase {
  constructor(
    private readonly formApplicationAggregateRepository: FormApplicationAggregateRepository,
    private readonly formQuestionDataAggregateRepository: FormQuestionDataAggregateRepository,
    private readonly formRepository: FormRepository,
  ) {}

  async execute(params: IAddFormApplicationUseCase.Params) {
    const form = await this.formRepository.find({ id: params.formId, companyId: params.companyId });
    if (!form) throw new BadRequestException('Formulário não encontrado');

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

    const formApplicationAggregate = new FormApplicationAggregate({
      form,
      formApplication,
      participantsHierarchies,
      participantsWorkspaces,
    });

    if (params.identifier) {
      const questionIdentifiers = await asyncBatch({
        items: params.identifier.questions,
        batchSize: 10,
        callback: async (item) => {
          const identifierData = await this.formQuestionDataAggregateRepository.find({ id: item.questionDataId, companyId: params.companyId });
          if (!identifierData) throw new BadRequestException('Pergunta não encontrada');

          return new FormQuestionIdentifierAggregate({
            identifierData,
            question: new FormQuestionEntity({
              order: item.order,
              required: item.required,
            }),
          });
        },
      });

      const identifier = new FormQuestionIdentifierGroupAggregate({
        group: new FormQuestionIdentifierGroupEntity({
          name: params.identifier.name,
          description: params.identifier.description,
        }),
        questionIdentifiers: questionIdentifiers,
      });

      formApplicationAggregate.identifier = identifier;
    }

    await this.formApplicationAggregateRepository.create(formApplicationAggregate);
  }
}
