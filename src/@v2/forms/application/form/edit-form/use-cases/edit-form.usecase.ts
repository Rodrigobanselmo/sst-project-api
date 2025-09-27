import { FormAggregateRepository } from '@/@v2/forms/database/repositories/form/form-aggregate.repository';
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IEditFormUseCase } from './edit-form.types';

@Injectable()
export class EditFormUseCase {
  constructor(
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly formAggregateRepository: FormAggregateRepository,
  ) {}

  async execute(params: IEditFormUseCase.Params) {
    const loggedUser = this.context.get<UserContext>(ContextKey.USER);

    const existingForm = await this.formAggregateRepository.find({
      id: params.formId,
      companyId: params.companyId,
    });

    if (!existingForm) throw new NotFoundException('Formulário não encontrado');

    // System forms can only be edited by the system itself, not by regular users
    if (existingForm.form.system && !loggedUser.isAdmin) {
      throw new BadRequestException('Formulário não pode ser editado, é um formulário padrão do sistema');
    }

    existingForm.updateForm({
      name: params.name,
      description: params.description,
      type: params.type,
      anonymous: params.anonymous,
      shareableLink: params.shareableLink,
    });

    if (params.questionGroups) {
      existingForm.updateQuestionGroups({
        questionGroups: params.questionGroups,
      });
    }

    const updatedFormAggregate = await this.formAggregateRepository.update(existingForm);

    return updatedFormAggregate;
  }
}
