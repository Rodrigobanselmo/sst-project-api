import { FormApplicationAggregateRepository } from '@/@v2/forms/database/repositories/form-application/form-application-aggregate.repository';
import { FormRepository } from '@/@v2/forms/database/repositories/form/form.repository';
import { FormParticipantsHierarchyEntity } from '@/@v2/forms/domain/entities/form-participants-hierarchy.entity';
import { FormParticipantsWorkspaceEntity } from '@/@v2/forms/domain/entities/form-participants-workspace.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IEditFormApplicationUseCase } from './edit-form-application.types';
// import { FormQuestionDataAggregateRepository } from '@/@v2/forms/database/repositories/Form-question-identifier/Form-question-identifier-data-aggregate.repository';

@Injectable()
export class EditFormApplicationUseCase {
  constructor(
    private readonly formApplicationAggregateRepository: FormApplicationAggregateRepository,
    private readonly formRepository: FormRepository,
    // private readonly formQuestionDataAggregateRepository: FormQuestionDataAggregateRepository,
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

    await this.formApplicationAggregateRepository.update(formApplication);
  }
}
