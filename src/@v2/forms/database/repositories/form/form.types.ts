import { FormEntity } from '@/@v2/forms/domain/entities/form.entity';

export namespace IFormRepository {
  export type CreateParams = FormEntity;
  export type CreateReturn = Promise<FormEntity | null>;

  export type UpdateParams = FormEntity;
  export type UpdateReturn = Promise<FormEntity | null>;

  export type FindParams = { id: string; companyId: string };
  export type FindReturn = Promise<FormEntity | null>;

  export type DeleteParams = FormEntity;
}
