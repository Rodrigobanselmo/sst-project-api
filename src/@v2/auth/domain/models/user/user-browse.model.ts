import { PaginationModel } from '@/@v2/shared/models/common/pagination.model';
import { UserBrowseFilterModel } from './user-browse-filter.model';
import { UserBrowseResultModel } from './user-browse-result.model';

export type IUserBrowseModel = {
  results: UserBrowseResultModel[];
  pagination: PaginationModel;
  filters: UserBrowseFilterModel;
};

export class UserBrowseModel {
  results: UserBrowseResultModel[];
  pagination: PaginationModel;
  filters: UserBrowseFilterModel;

  constructor(params: IUserBrowseModel) {
    this.results = params.results;
    this.pagination = params.pagination;
    this.filters = params.filters;
  }
}
