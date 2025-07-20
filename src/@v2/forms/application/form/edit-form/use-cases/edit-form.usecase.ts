import { FormAggregateRepository } from '@/@v2/forms/database/repositories/form/form-aggregate.repository';
import { FormAggregate } from '@/@v2/forms/domain/aggregates/form.aggregate';
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
        companyId: params.companyId,
        system: loggedUser.isAdmin,
      });
    }

    const updatedFormAggregate = await this.formAggregateRepository.update(existingForm);

    return updatedFormAggregate;
  }
}
