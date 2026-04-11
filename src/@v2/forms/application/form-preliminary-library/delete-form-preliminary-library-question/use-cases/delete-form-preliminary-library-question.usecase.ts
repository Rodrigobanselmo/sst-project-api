import { assertSystemItemDeletableByUser } from '@/@v2/forms/application/form-preliminary-library/shared/form-preliminary-library.validation';
import { FormPreliminaryLibraryDAO } from '@/@v2/forms/database/dao/form-preliminary-library/form-preliminary-library.dao';
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DeleteFormPreliminaryLibraryQuestionUseCase {
  constructor(
    private readonly dao: FormPreliminaryLibraryDAO,
    @Inject(SharedTokens.Context) private readonly context: LocalContext,
  ) {}

  async execute(params: { companyId: string; questionId: string }) {
    const user = this.context.get<UserContext>(ContextKey.USER);
    const existing = await this.dao.readQuestionForCompany(params.companyId, params.questionId);
    if (!existing) {
      throw new NotFoundException('Pergunta não encontrada na biblioteca.');
    }

    assertSystemItemDeletableByUser(existing.system, user.isAdmin);

    const blocksUsingQuestion = await this.dao.countActiveBlocksReferencingLibraryQuestion(params.questionId);
    if (blocksUsingQuestion > 0) {
      throw new BadRequestException(
        'Esta pergunta não pode ser excluída porque ainda faz parte de um ou mais blocos ativos da biblioteca. Remova-a dos blocos antes de excluir.',
      );
    }

    if (existing.system) {
      const result = await this.dao.softDeleteSystemLibraryQuestion(params.questionId);
      if (!result) {
        throw new NotFoundException('Pergunta não encontrada na biblioteca.');
      }
      return result;
    }

    if (!existing.company_id) {
      throw new NotFoundException('Pergunta não encontrada na biblioteca.');
    }

    const result = await this.dao.softDeleteQuestion(existing.company_id, params.questionId);
    if (!result) {
      throw new NotFoundException('Pergunta não encontrada na biblioteca.');
    }
    return result;
  }
}
