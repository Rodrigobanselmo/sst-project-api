export type ISubTypeBrowseResultModel = {
  id: number;
  name: string;
};

export class SubTypeBrowseResultModel {
  id: number;
  name: string;

  constructor(params: ISubTypeBrowseResultModel) {
    this.id = params.id;
    this.name = params.name;
  }
}
