import { FormApplicationEntity } from '@/@v2/forms/domain/entities/form-application.entity';

export namespace IFormApplicationRepository {
  export type FindParams = { id: string; companyId: string | undefined };
  export type FindReturn = Promise<FormApplicationEntity | null>;

  export type DeleteParams = FormApplicationEntity;
}
