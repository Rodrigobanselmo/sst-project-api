import { FormApplicationAggregateRepository } from '@/@v2/forms/database/repositories/form-application/form-application-aggregate.repository';
import { FormQuestionIdentifierEntityRepository } from '@/@v2/forms/database/repositories/form-question-identifier/form-question-identifier.repository';
import { FormRepository } from '@/@v2/forms/database/repositories/form/form.repository';
import { FormParticipantsHierarchyEntity } from '@/@v2/forms/domain/entities/form-participants-hierarchy.entity';
import { FormParticipantsWorkspaceEntity } from '@/@v2/forms/domain/entities/form-participants-workspace.entity';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FormQuestionParams, IEditFormApplicationUseCase } from './edit-form-application.types';
import { IIdentifierQuestionInput } from '@/@v2/forms/domain/aggregates/form-application.aggregate';

@Injectable()
export class EditFormApplicationUseCase {
  constructor(
    private readonly formApplicationAggregateRepository: FormApplicationAggregateRepository,
    private readonly formQuestionIdentifierEntityRepository: FormQuestionIdentifierEntityRepository,
    private readonly formRepository: FormRepository,
  ) {}

  async execute(params: IEditFormApplicationUseCase.Params) {
    const formApplication = await this.formApplicationAggregateRepository.find({ id: params.applicationId, companyId: params.companyId });
    if (!formApplication) throw new BadRequestException('Formulário não encontrado');

    formApplication.formApplication.update(params);

    if (params.status) {
      const [, error] = formApplication.formApplication.setStatus(params.status);
      if (error) throw new BadRequestException(error.message);
    }

    if (params.formId) {
      const form = await this.formRepository.find({ id: params.formId, companyId: params.companyId });
      if (!form) throw new BadRequestException('Modelo do formulário não encontrado');

      const [, error] = formApplication.setForm(form);
      if (error) throw new BadRequestException(error.message);
    }

    if (params.hierarchyIds) {
      const participantsHierarchies = params.hierarchyIds.map((hierarchyId) => {
        return new FormParticipantsHierarchyEntity({ hierarchyId });
      });

      const [, error] = formApplication.setParticipantsHierarchies(participantsHierarchies);
      if (error) throw new BadRequestException(error.message);
    }

    if (params.workspaceIds) {
      const participantsWorkspaces = params.workspaceIds.map((workspaceId) => {
        return new FormParticipantsWorkspaceEntity({ workspaceId });
      });

      const [, error] = formApplication.setParticipantsWorkspaces(participantsWorkspaces);
      if (error) throw new BadRequestException(error.message);
    }

    if (params.identifier) {
      const questionsWithIdentifiers = await asyncBatch<FormQuestionParams, IIdentifierQuestionInput>({
        items: params.identifier.questions,
        batchSize: 10,
        callback: async (question) => {
          const identifierEntity = await this.formQuestionIdentifierEntityRepository.find({ type: question.details.identifierType });
          if (!identifierEntity) throw new BadRequestException('Tipo de pergunta não encontrada');

          return {
            id: question.id,
            required: question.required,
            details: {
              text: question.details.text,
              type: question.details.type,
              acceptOther: question.details.acceptOther,
            },
            options: question.options?.map((option) => ({
              id: option.id,
              text: option.text,
              value: option.value,
            })),
            identifierEntity,
          };
        },
      });

      const [, error] = formApplication.updateIdentifier({
        identifier: {
          name: params.identifier.name,
          description: params.identifier.description,
          questions: questionsWithIdentifiers,
        },
      });
      if (error) throw new BadRequestException(error.message);
    }

    await this.formApplicationAggregateRepository.update(formApplication);
  }
}
