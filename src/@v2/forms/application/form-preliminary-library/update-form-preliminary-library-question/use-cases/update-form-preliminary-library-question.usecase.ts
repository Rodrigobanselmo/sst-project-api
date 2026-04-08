import {
  assertMutableByCompany,
  rejectSectorIdentifierForLibrary,
  validateOptionsForQuestionType,
} from '@/@v2/forms/application/form-preliminary-library/shared/form-preliminary-library.validation';
import { FormPreliminaryLibraryDAO } from '@/@v2/forms/database/dao/form-preliminary-library/form-preliminary-library.dao';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  FormIdentifierTypeEnum,
  FormPreliminaryLibraryCategoryEnum,
  FormPreliminaryLibraryQuestionTypeEnum,
} from '@prisma/client';

export namespace UpdateFormPreliminaryLibraryQuestionUseCase {
  export type Params = {
    companyId: string;
    questionId: string;
    name?: string;
    questionText?: string;
    questionType?: FormPreliminaryLibraryQuestionTypeEnum;
    category?: FormPreliminaryLibraryCategoryEnum;
    identifierType?: FormIdentifierTypeEnum;
    acceptOther?: boolean;
    options?: { text: string; order: number; value?: number | null }[];
  };
}

@Injectable()
export class UpdateFormPreliminaryLibraryQuestionUseCase {
  constructor(private readonly dao: FormPreliminaryLibraryDAO) {}

  async execute(params: UpdateFormPreliminaryLibraryQuestionUseCase.Params) {
    const existing = await this.dao.readQuestionCompanyScoped(params.companyId, params.questionId);
    if (!existing) {
      throw new NotFoundException('Pergunta não encontrada ou não pertence à empresa.');
    }
    assertMutableByCompany(existing.system);

    const identifierType = params.identifierType ?? existing.identifier_type;
    const questionType = params.questionType ?? existing.question_type;
    rejectSectorIdentifierForLibrary(identifierType);

    if (params.options !== undefined) {
      validateOptionsForQuestionType(questionType, identifierType, params.options);
    }

    const updated = await this.dao.updateQuestionWithOptions(params.companyId, params.questionId, {
      name: params.name,
      question_text: params.questionText,
      question_type: params.questionType,
      category: params.category,
      identifier_type: params.identifierType,
      accept_other: params.acceptOther,
      options: params.options,
    });

    if (!updated) {
      throw new NotFoundException('Pergunta não encontrada ou não pertence à empresa.');
    }
    return updated;
  }
}
