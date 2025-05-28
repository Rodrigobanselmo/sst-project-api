export type IAbsenteeismTotalEmployeeResultBrowseModel = {
  id: number;
  name: string;
  total: number;
  totalDays: number;
};

export class AbsenteeismTotalEmployeeResultBrowseModel {
  id: number;
  name: string;
  total: number;
  totalDays: number;

  constructor(params: IAbsenteeismTotalEmployeeResultBrowseModel) {
    this.id = params.id;
    this.name = params.name;
    this.total = params.total;
    this.totalDays = params.totalDays;
  }
}
