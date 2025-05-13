import { PaginationModel } from '@/@v2/shared/models/common/pagination.model';
import { SubTypeBrowseResultModel } from './sub-type-browse-result.model';

export type ISubTypeBrowseModel = {
  pagination: PaginationModel;
  results: SubTypeBrowseResultModel[];
};

export class SubTypeBrowseModel {
  results: SubTypeBrowseResultModel[];
  pagination: PaginationModel;

  constructor(params: ISubTypeBrowseModel) {
    this.results = params.results;
    this.pagination = params.pagination;
  }
}
