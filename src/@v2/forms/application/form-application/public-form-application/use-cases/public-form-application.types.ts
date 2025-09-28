import { FormApplicationReadPublicModel } from '@/@v2/forms/domain/models/form-application/form-application-read-public.model';

export namespace IPublicFormApplicationUseCase {
  export type Params = {
    applicationId: string;
    employeeId?: number;
  };

  export type Result = {
    data: FormApplicationReadPublicModel | null;
    options?: {
      hierarchies: any[];
    };
    hierarchyId?: string;
    employeeId?: number;
    hasAlreadyAnswered?: boolean;
    isPublic: boolean;
    isTesting: boolean;
  };
}
