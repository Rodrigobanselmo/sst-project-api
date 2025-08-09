import { FormApplicationReadPublicModel } from '@/@v2/forms/domain/models/form-application/form-application-read-public.model';

export namespace IPublicFormApplicationUseCase {
  export type Params = {
    applicationId: string;
  };

  export type Result = {
    data: FormApplicationReadPublicModel | null;
    isPublic: boolean;
    isTesting: boolean;
  };
}
