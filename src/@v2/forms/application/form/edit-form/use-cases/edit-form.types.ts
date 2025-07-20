import { FormTypeEnum } from '@/@v2/forms/domain/enums/form-type.enum';
import { FormQuestionTypeEnum } from '@/@v2/forms/domain/enums/form-question-type.enum';

export class FormQuestionOptionParams {
  id?: number;
  text: string;
  value?: number;
}

export class FormQuestionDataParams {
  id?: number;
  text: string;
  type: FormQuestionTypeEnum;
  acceptOther?: boolean;
}

export class FormQuestionParams {
  id?: number;
  required?: boolean;
  data: FormQuestionDataParams;
  options?: FormQuestionOptionParams[];
}

export class FormQuestionGroupParams {
  id?: number;
  name: string;
  description?: string;
  questions: FormQuestionParams[];
}

export namespace IEditFormUseCase {
  export type Params = {
    formId: number;
    companyId: string;
    name: string;
    description?: string;
    type?: FormTypeEnum;
    anonymous?: boolean;
    shareableLink?: boolean;
    questionGroups?: FormQuestionGroupParams[];
  };
}
