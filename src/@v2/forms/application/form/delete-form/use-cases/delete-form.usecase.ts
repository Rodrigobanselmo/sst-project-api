import { FormAggregateRepository } from '@/@v2/forms/database/repositories/form/form-aggregate.repository';
import { FormRepository } from '@/@v2/forms/database/repositories/form/form.repository';
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';

export namespace IDeleteFormUseCase {
  export type Params = {
    companyId: string;
    formId: string;
  };
}

@Injectable()
export class DeleteFormUseCase {
  constructor(
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly formAggregateRepository: FormAggregateRepository,
    private readonly formRepository: FormRepository,
  ) {}

  async execute(params: IDeleteFormUseCase.Params): Promise<void> {
    const loggedUser = this.context.get<UserContext>(ContextKey.USER);

    const existingForm = await this.formAggregateRepository.find({
      id: params.formId,
      companyId: params.companyId,
    });

    if (!existingForm) {
      throw new NotFoundException('Modelo de formulário não encontrado');
    }

    if (existingForm.form.system && !loggedUser.isAdmin) {
      throw new BadRequestException(
        'Este modelo é global (sistema) e só pode ser arquivado por um usuário master.',
      );
    }

    const deleted = await this.formRepository.delete(existingForm.form);

    if (!deleted) {
      throw new BadRequestException('Não foi possível excluir o modelo de formulário');
    }
  }
}
