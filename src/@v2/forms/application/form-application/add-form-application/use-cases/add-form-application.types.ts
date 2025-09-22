import { FormIdentifierTypeEnum } from '@/@v2/forms/domain/enums/form-identifier-type.enum';
import { FormQuestionTypeEnum } from '@/@v2/forms/domain/enums/form-question-type.enum';

export interface FormQuestionOptionParams {
  text: string;
  value?: number;
}

export interface FormQuestionDetailsParams {
  text: string;
  identifierType: FormIdentifierTypeEnum;
  acceptOther?: boolean;
}

export type FormQuestionParams = {
  required?: boolean;
  details: FormQuestionDetailsParams;
  options?: FormQuestionOptionParams[];
};
export namespace IAddFormApplicationUseCase {
  export type Params = {
    name: string;
    description?: string;
    companyId: string;
    formId: string;
    workspaceIds: string[];
    hierarchyIds: string[];
    anonymous?: boolean;
    shareableLink?: boolean;
    identifier: {
      name: string;
      description?: string;
      questions: FormQuestionParams[];
    };
  };
}
