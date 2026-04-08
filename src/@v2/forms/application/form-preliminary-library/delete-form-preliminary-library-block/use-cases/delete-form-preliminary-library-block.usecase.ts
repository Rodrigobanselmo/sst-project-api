import { assertMutableByCompany } from '@/@v2/forms/application/form-preliminary-library/shared/form-preliminary-library.validation';
import { FormPreliminaryLibraryDAO } from '@/@v2/forms/database/dao/form-preliminary-library/form-preliminary-library.dao';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DeleteFormPreliminaryLibraryBlockUseCase {
  constructor(private readonly dao: FormPreliminaryLibraryDAO) {}

  async execute(params: { companyId: string; blockId: string }) {
    const existing = await this.dao.readBlockCompanyScoped(params.companyId, params.blockId);
    if (!existing) {
      throw new NotFoundException('Bloco não encontrado ou não pertence à empresa.');
    }
    assertMutableByCompany(existing.system);

    const result = await this.dao.softDeleteBlock(params.companyId, params.blockId);
    if (!result) {
      throw new NotFoundException('Bloco não encontrado ou não pertence à empresa.');
    }
    return result;
  }
}
