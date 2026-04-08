import {
  assertValidSystemCompanyPair,
  rejectSectorIdentifierForLibrary,
  validateOptionsForQuestionType,
} from '@/@v2/forms/application/form-preliminary-library/shared/form-preliminary-library.validation';
import { FormPreliminaryLibraryDAO } from '@/@v2/forms/database/dao/form-preliminary-library/form-preliminary-library.dao';
import { Injectable } from '@nestjs/common';
import {
  FormIdentifierTypeEnum,
  FormPreliminaryLibraryCategoryEnum,
  FormPreliminaryLibraryQuestionTypeEnum,
} from '@prisma/client';

export namespace CreateFormPreliminaryLibraryQuestionUseCase {
  export type Params = {
    companyId: string;
    name: string;
    questionText: string;
    questionType: FormPreliminaryLibraryQuestionTypeEnum;
    category: FormPreliminaryLibraryCategoryEnum;
    identifierType: FormIdentifierTypeEnum;
    acceptOther: boolean;
    options: { text: string; order: number; value?: number | null }[];
  };
}

@Injectable()
export class CreateFormPreliminaryLibraryQuestionUseCase {
  constructor(private readonly dao: FormPreliminaryLibraryDAO) {}

  async execute(params: CreateFormPreliminaryLibraryQuestionUseCase.Params) {
    const system = false;
    assertValidSystemCompanyPair(system, params.companyId);
    rejectSectorIdentifierForLibrary(params.identifierType);
    validateOptionsForQuestionType(params.questionType, params.identifierType, params.options);

    return this.dao.createQuestionWithOptions({
      system,
      company_id: params.companyId,
      name: params.name,
      question_text: params.questionText,
      question_type: params.questionType,
      category: params.category,
      identifier_type: params.identifierType,
      accept_other: params.acceptOther,
      options: params.options,
    });
  }
}
