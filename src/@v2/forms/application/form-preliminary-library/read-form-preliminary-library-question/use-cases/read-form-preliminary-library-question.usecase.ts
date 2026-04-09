import { FormPreliminaryLibraryDAO } from '@/@v2/forms/database/dao/form-preliminary-library/form-preliminary-library.dao';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ReadFormPreliminaryLibraryQuestionUseCase {
  constructor(private readonly dao: FormPreliminaryLibraryDAO) {}

  async execute(params: { companyId: string; questionId: string }) {
    const row = await this.dao.readQuestionForCompany(params.companyId, params.questionId);
    if (!row) {
      throw new NotFoundException('Pergunta não encontrada na biblioteca.');
    }
    return row;
  }
}
