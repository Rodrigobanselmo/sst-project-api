import { FormPreliminaryLibraryDAO } from '@/@v2/forms/database/dao/form-preliminary-library/form-preliminary-library.dao';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ReadFormPreliminaryLibraryBlockUseCase {
  constructor(private readonly dao: FormPreliminaryLibraryDAO) {}

  async execute(params: { companyId: string; blockId: string }) {
    const row = await this.dao.readBlockDetailForCompany(params.companyId, params.blockId);
    if (!row) {
      throw new NotFoundException('Bloco não encontrado na biblioteca.');
    }
    return row;
  }
}
