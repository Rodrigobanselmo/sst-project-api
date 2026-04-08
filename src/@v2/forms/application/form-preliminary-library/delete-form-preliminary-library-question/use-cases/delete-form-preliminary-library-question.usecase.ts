import { assertMutableByCompany } from '@/@v2/forms/application/form-preliminary-library/shared/form-preliminary-library.validation';
import { FormPreliminaryLibraryDAO } from '@/@v2/forms/database/dao/form-preliminary-library/form-preliminary-library.dao';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DeleteFormPreliminaryLibraryQuestionUseCase {
  constructor(private readonly dao: FormPreliminaryLibraryDAO) {}

  async execute(params: { companyId: string; questionId: string }) {
    const existing = await this.dao.readQuestionCompanyScoped(params.companyId, params.questionId);
    if (!existing) {
      throw new NotFoundException('Pergunta não encontrada ou não pertence à empresa.');
    }
    assertMutableByCompany(existing.system);

    const result = await this.dao.softDeleteQuestion(params.companyId, params.questionId);
    if (!result) {
      throw new NotFoundException('Pergunta não encontrada ou não pertence à empresa.');
    }
    return result;
  }
}
