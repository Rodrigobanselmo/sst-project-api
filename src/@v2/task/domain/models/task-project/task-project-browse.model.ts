import { PaginationModel } from '@/@v2/shared/models/common/pagination.model';
import { TaskProjectBrowseFilterModel } from './task-project-browse-filter.model';
import { TaskProjectBrowseResultModel } from './task-project-browse-result.model';

export type ITaskProjectBrowseModel = {
  results: TaskProjectBrowseResultModel[];
  pagination: PaginationModel;
  filters: TaskProjectBrowseFilterModel;
};

export class TaskProjectBrowseModel {
  results: TaskProjectBrowseResultModel[];
  pagination: PaginationModel;
  filters: TaskProjectBrowseFilterModel;

  constructor(params: ITaskProjectBrowseModel) {
    this.results = params.results;
    this.pagination = params.pagination;
    this.filters = params.filters;
  }
}
