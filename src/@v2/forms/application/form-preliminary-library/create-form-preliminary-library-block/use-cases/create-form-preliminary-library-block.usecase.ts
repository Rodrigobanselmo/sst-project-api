import { assertValidSystemCompanyPair } from '@/@v2/forms/application/form-preliminary-library/shared/form-preliminary-library.validation';
import { FormPreliminaryLibraryDAO } from '@/@v2/forms/database/dao/form-preliminary-library/form-preliminary-library.dao';
import { BadRequestException, Injectable } from '@nestjs/common';

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
  constructor(private readonly dao: FormPreliminaryLibraryDAO) {}

  async execute(params: CreateFormPreliminaryLibraryBlockUseCase.Params) {
    const system = false;
    assertValidSystemCompanyPair(system, params.companyId);

    if (!params.items?.length) {
      throw new BadRequestException('O bloco deve conter pelo menos uma pergunta.');
    }

    const questionIds = params.items.map((i) => i.libraryQuestionId);
    await this.dao.assertQuestionsAccessibleForBlock(params.companyId, questionIds);

    return this.dao.createBlockWithItems({
      system,
      company_id: params.companyId,
      name: params.name,
      description: params.description,
      items: params.items.map((i) => ({
        library_question_id: i.libraryQuestionId,
        order: i.order,
      })),
    });
  }
}
