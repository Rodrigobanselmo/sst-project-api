import { PaginationModel } from '@/@v2/shared/models/common/pagination.model';
import { UserBrowseResultModel } from './user-browse-result.model';

export type IUserBrowseModel = {
  results: UserBrowseResultModel[];
  pagination: PaginationModel;
};

export class UserBrowseModel {
  results: UserBrowseResultModel[];
  pagination: PaginationModel;

  constructor(params: IUserBrowseModel) {
    this.results = params.results;
    this.pagination = params.pagination;
  }
}
