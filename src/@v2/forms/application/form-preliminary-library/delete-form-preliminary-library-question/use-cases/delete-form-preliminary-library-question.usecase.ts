import { assertMutableByCompany } from '@/@v2/forms/application/form-preliminary-library/shared/form-preliminary-library.validation';
import { FormPreliminaryLibraryDAO } from '@/@v2/forms/database/dao/form-preliminary-library/form-preliminary-library.dao';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DeleteFormPreliminaryLibraryQuestionUseCase {
  constructor(private readonly dao: FormPreliminaryLibraryDAO) {}

  async execute(params: { companyId: string; questionId: string }) {
    /** Mesma regra de visibilidade do GET {@link ReadFormPreliminaryLibraryQuestionUseCase} (consultoria / OR do catálogo). */
    const existing = await this.dao.readQuestionForCompany(params.companyId, params.questionId);
    if (!existing) {
      throw new NotFoundException('Pergunta não encontrada na biblioteca.');
    }
    assertMutableByCompany(existing.system);

    if (!existing.company_id) {
      throw new NotFoundException('Pergunta não encontrada na biblioteca.');
    }

    const blocksUsingQuestion = await this.dao.countActiveBlocksReferencingLibraryQuestion(params.questionId);
    if (blocksUsingQuestion > 0) {
      throw new BadRequestException(
        'Esta pergunta não pode ser excluída porque ainda faz parte de um ou mais blocos ativos da biblioteca. Remova-a dos blocos antes de excluir.',
      );
    }

    const result = await this.dao.softDeleteQuestion(existing.company_id, params.questionId);
    if (!result) {
      throw new NotFoundException('Pergunta não encontrada na biblioteca.');
    }
    return result;
  }
}
