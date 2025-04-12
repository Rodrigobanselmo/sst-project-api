import { FormTypeEnum } from '../../enums/form-type.enum';

export type IFormBrowseFilterModel = {
  types: FormTypeEnum[];
};

export class FormBrowseFilterModel {
  types: FormTypeEnum[];

  constructor(params: IFormBrowseFilterModel) {
    this.types = params.types || [];
  }
}
