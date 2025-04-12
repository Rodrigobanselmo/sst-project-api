import { FormStatusEnum } from '../../enums/form-status.enum';

export type IFormApplicationBrowseFilterModel = {
  status: FormStatusEnum[];
};

export class FormApplicationBrowseFilterModel {
  status: FormStatusEnum[];

  constructor(params: IFormApplicationBrowseFilterModel) {
    this.status = params.status || [];
  }
}
