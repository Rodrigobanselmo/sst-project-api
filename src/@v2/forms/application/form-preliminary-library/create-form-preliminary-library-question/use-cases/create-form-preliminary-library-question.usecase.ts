import {
  assertValidSystemCompanyPair,
  rejectSectorIdentifierForLibrary,
  validateOptionsForQuestionType,
} from '@/@v2/forms/application/form-preliminary-library/shared/form-preliminary-library.validation';
import { FormPreliminaryLibraryDAO } from '@/@v2/forms/database/dao/form-preliminary-library/form-preliminary-library.dao';
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { Inject, Injectable } from '@nestjs/common';
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
  constructor(
    private readonly dao: FormPreliminaryLibraryDAO,
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
  ) {}

  async execute(params: CreateFormPreliminaryLibraryQuestionUseCase.Params) {
    const user = this.context.get<UserContext>(ContextKey.USER);
    /** Alinhado a {@link AddFormUseCase}: catálogo global só para admin global (`UserContext.isAdmin`). */
    const system = user.isAdmin;
    const company_id = system ? null : params.companyId;
    assertValidSystemCompanyPair(system, company_id);
    rejectSectorIdentifierForLibrary(params.identifierType);
    validateOptionsForQuestionType(params.questionType, params.identifierType, params.options);

    return this.dao.createQuestionWithOptions({
      system,
      company_id,
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
