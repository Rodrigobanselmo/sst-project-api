export type IDocumentControlBrowseFilterModel = {
  types: string[];
};

export class DocumentControlBrowseFilterModel {
  types: string[];

  constructor(params: IDocumentControlBrowseFilterModel) {
    this.types = params.types;
  }
}
