import { FormTypeEnum } from '@/@v2/forms/domain/enums/form-type.enum';
import { FormQuestionTypeEnum } from '@/@v2/forms/domain/enums/form-question-type.enum';

export class FormQuestionOptionParams {
  id?: string;
  text: string;
  value?: number;
}

export class FormQuestionDataParams {
  id?: string;
  text: string;
  type: FormQuestionTypeEnum;
  acceptOther?: boolean;
  risksIds?: string[];
}

export class FormQuestionParams {
  id?: string;
  required?: boolean;
  details: FormQuestionDataParams;
  options?: FormQuestionOptionParams[];
}

export class FormQuestionGroupParams {
  id?: string;
  name: string;
  description?: string;
  questions: FormQuestionParams[];
}

export namespace IEditFormUseCase {
  export type Params = {
    formId: string;
    companyId: string;
    name: string;
    description?: string;
    type?: FormTypeEnum;
    anonymous?: boolean;
    shareableLink?: boolean;
    questionGroups?: FormQuestionGroupParams[];
  };
}
