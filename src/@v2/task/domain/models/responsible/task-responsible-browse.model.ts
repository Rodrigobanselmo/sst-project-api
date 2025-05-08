import { PaginationModel } from '@/@v2/shared/models/common/pagination.model';
import { TaskResponsibleBrowseResultModel } from './task-responsible-browse-result.model';

export type ITaskResponsibleBrowseModel = {
  results: TaskResponsibleBrowseResultModel[];
  pagination: PaginationModel;
};

export class TaskResponsibleBrowseModel {
  results: TaskResponsibleBrowseResultModel[];
  pagination: PaginationModel;

  constructor(params: ITaskResponsibleBrowseModel) {
    this.results = params.results;
    this.pagination = params.pagination;
  }
}
