import { PaginationModel } from '@/@v2/shared/models/common/pagination.model';
import { AbsenteeismTotalEmployeeResultBrowseModel, IAbsenteeismTotalEmployeeResultBrowseModel } from './absenteeism-total-employee-browse-result.model';

export type IAbsenteeismTotalEmployeeBrowseModel = {
  results: IAbsenteeismTotalEmployeeResultBrowseModel[];
  pagination: PaginationModel;
};

export class AbsenteeismTotalEmployeeBrowseModel {
  results: AbsenteeismTotalEmployeeResultBrowseModel[];
  pagination: PaginationModel;

  constructor(params: IAbsenteeismTotalEmployeeBrowseModel) {
    this.results = params.results.map((result) => new AbsenteeismTotalEmployeeResultBrowseModel(result));
    this.pagination = new PaginationModel(params.pagination);
  }
}
