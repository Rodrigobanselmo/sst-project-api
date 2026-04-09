import { assertMutableByCompany } from '@/@v2/forms/application/form-preliminary-library/shared/form-preliminary-library.validation';
import { FormPreliminaryLibraryDAO } from '@/@v2/forms/database/dao/form-preliminary-library/form-preliminary-library.dao';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

export namespace UpdateFormPreliminaryLibraryBlockUseCase {
  export type Params = {
    companyId: string;
    blockId: string;
    name?: string;
    description?: string | null;
    items?: { libraryQuestionId: string; order: number }[];
  };
}

@Injectable()
export class UpdateFormPreliminaryLibraryBlockUseCase {
  constructor(private readonly dao: FormPreliminaryLibraryDAO) {}

  async execute(params: UpdateFormPreliminaryLibraryBlockUseCase.Params) {
    const existing = await this.dao.readBlockCompanyScoped(params.companyId, params.blockId);
    if (!existing) {
      throw new NotFoundException('Bloco não encontrado ou não pertence à empresa.');
    }
    assertMutableByCompany(existing.system);

    if (params.items !== undefined) {
      if (!params.items.length) {
        throw new BadRequestException('O bloco deve conter pelo menos uma pergunta.');
      }
      const questionIds = params.items.map((i) => i.libraryQuestionId);
      await this.dao.assertQuestionsAccessibleForBlock(params.companyId, questionIds);
    }

    const updated = await this.dao.updateBlockWithItems(params.companyId, params.blockId, {
      name: params.name,
      description: params.description,
      items: params.items?.map((i) => ({
        library_question_id: i.libraryQuestionId,
        order: i.order,
      })),
    });

    if (!updated) {
      throw new NotFoundException('Bloco não encontrado ou não pertence à empresa.');
    }
    return updated;
  }
}
