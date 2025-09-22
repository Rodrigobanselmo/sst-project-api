import { FormStatusEnum } from '@/@v2/forms/domain/enums/form-status.enum';
import { FormIdentifierTypeEnum } from '@/@v2/forms/domain/enums/form-identifier-type.enum';
import { FormQuestionTypeEnum } from '@/@v2/forms/domain/enums/form-question-type.enum';

export interface FormQuestionOptionParams {
  id?: string;
  text: string;
  value?: number;
}

export interface FormQuestionDetailsParams {
  text: string;
  type: FormQuestionTypeEnum;
  identifierType: FormIdentifierTypeEnum;
  acceptOther?: boolean;
}

export type FormQuestionParams = {
  id?: string;
  required?: boolean;
  details: FormQuestionDetailsParams;
  options?: FormQuestionOptionParams[];
};

export namespace IEditFormApplicationUseCase {
  export type Params = {
    applicationId: string;
    companyId: string;
    name?: string;
    description?: string | null;
    formId?: string;
    status?: FormStatusEnum;
    workspaceIds?: string[];
    hierarchyIds?: string[];
    anonymous?: boolean;
    shareableLink?: boolean;
    identifier?: {
      name?: string;
      description?: string;
      questions?: FormQuestionParams[];
    };
  };
}
