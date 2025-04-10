export type IFormApplicationBrowseFilterModel = {
  types: string[];
};

export class FormApplicationBrowseFilterModel {
  types: string[];

  constructor(params: IFormApplicationBrowseFilterModel) {
    this.types = params.types || [];
  }
}
