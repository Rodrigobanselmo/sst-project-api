import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';

export type ICompanyEntity = {
  id: number;
};

export class CompanyEntity {
  id: number;

  constructor(params: ICompanyEntity) {
    this.id = params.id;
  }
}
