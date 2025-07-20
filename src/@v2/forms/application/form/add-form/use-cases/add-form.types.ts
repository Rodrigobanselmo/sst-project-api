import { FormTypeEnum } from '@/@v2/forms/domain/enums/form-type.enum';
import { FormQuestionTypeEnum } from '@/@v2/forms/domain/enums/form-question-type.enum';

export class FormQuestionOptionParams {
  text: string;
  value?: number;
}

export class FormQuestionDataParams {
  text: string;
  type: FormQuestionTypeEnum;
  acceptOther?: boolean;
}

export class FormQuestionParams {
  required?: boolean;
  data: FormQuestionDataParams;
  options?: FormQuestionOptionParams[];
}

export class FormQuestionGroupParams {
  name: string;
  description?: string;
  questions: FormQuestionParams[];
}

export namespace IAddFormUseCase {
  export type Params = {
    companyId: string;
    name: string;
    description?: string;
    type?: FormTypeEnum;
    anonymous?: boolean;
    shareableLink?: boolean;
    questionGroups?: FormQuestionGroupParams[];
  };
}
