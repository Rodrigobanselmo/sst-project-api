import { FormStatusEnum } from '@/@v2/forms/domain/enums/form-status.enum';

export namespace IEditFormApplicationUseCase {
  export type Params = {
    applicationId: string;
    companyId: string;
    name?: string;
    description?: string | null;
    formId?: number;
    status?: FormStatusEnum;
    workspaceIds?: string[];
    hierarchyIds?: string[];
    identifier?: {
      name?: string;
      description?: string;
      questions?: {
        required: boolean;
        order: number;
        questionDataId: number;
      }[];
    };
  };
}
