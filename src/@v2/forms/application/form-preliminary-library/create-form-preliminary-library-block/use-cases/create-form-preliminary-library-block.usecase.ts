import { assertValidSystemCompanyPair } from '@/@v2/forms/application/form-preliminary-library/shared/form-preliminary-library.validation';
import { FormPreliminaryLibraryDAO } from '@/@v2/forms/database/dao/form-preliminary-library/form-preliminary-library.dao';
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';

export namespace CreateFormPreliminaryLibraryBlockUseCase {
  export type Params = {
    companyId: string;
    name: string;
    description?: string | null;
    items: { libraryQuestionId: string; order: number }[];
  };
}

@Injectable()
export class CreateFormPreliminaryLibraryBlockUseCase {
  constructor(
    private readonly dao: FormPreliminaryLibraryDAO,
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
  ) {}

  async execute(params: CreateFormPreliminaryLibraryBlockUseCase.Params) {
    const user = this.context.get<UserContext>(ContextKey.USER);
    /** Alinhado a {@link AddFormUseCase} / create pergunta da biblioteca. */
    const system = user.isAdmin;
    const company_id = system ? null : params.companyId;
    assertValidSystemCompanyPair(system, company_id);

    if (!params.items?.length) {
      throw new BadRequestException('O bloco deve conter pelo menos uma pergunta.');
    }

    const questionIds = params.items.map((i) => i.libraryQuestionId);
    await this.dao.assertQuestionsAccessibleForBlock(params.companyId, questionIds);

    return this.dao.createBlockWithItems({
      system,
      company_id,
      name: params.name,
      description: params.description,
      items: params.items.map((i) => ({
        library_question_id: i.libraryQuestionId,
        order: i.order,
      })),
    });
  }
}
