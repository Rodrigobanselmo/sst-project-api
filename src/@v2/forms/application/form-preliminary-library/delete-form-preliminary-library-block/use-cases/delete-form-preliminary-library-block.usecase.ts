import { assertSystemItemDeletableByUser } from '@/@v2/forms/application/form-preliminary-library/shared/form-preliminary-library.validation';
import { FormPreliminaryLibraryDAO } from '@/@v2/forms/database/dao/form-preliminary-library/form-preliminary-library.dao';
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DeleteFormPreliminaryLibraryBlockUseCase {
  constructor(
    private readonly dao: FormPreliminaryLibraryDAO,
    @Inject(SharedTokens.Context) private readonly context: LocalContext,
  ) {}

  async execute(params: { companyId: string; blockId: string }) {
    const user = this.context.get<UserContext>(ContextKey.USER);
    const existing = await this.dao.readBlockDetailForCompany(params.companyId, params.blockId);
    if (!existing) {
      throw new NotFoundException('Bloco não encontrado na biblioteca.');
    }

    assertSystemItemDeletableByUser(existing.system, user.isAdmin);

    if (existing.system) {
      const result = await this.dao.softDeleteSystemLibraryBlock(params.blockId);
      if (!result) {
        throw new NotFoundException('Bloco não encontrado na biblioteca.');
      }
      return result;
    }

    if (!existing.company_id) {
      throw new NotFoundException('Bloco não encontrado na biblioteca.');
    }

    const result = await this.dao.softDeleteBlock(existing.company_id, params.blockId);
    if (!result) {
      throw new NotFoundException('Bloco não encontrado na biblioteca.');
    }
    return result;
  }
}
