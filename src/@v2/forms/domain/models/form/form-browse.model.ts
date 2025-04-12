import { PaginationModel } from '@/@v2/shared/models/common/pagination.model';
import { FormBrowseFilterModel } from './form-browse-filter.model';
import { FormBrowseResultModel } from './form-browse-result.model';

export type IFormBrowseModel = {
  pagination: PaginationModel;
  results: FormBrowseResultModel[];
  filters: FormBrowseFilterModel;
};

export class FormBrowseModel {
  results: FormBrowseResultModel[];
  pagination: PaginationModel;
  filters: FormBrowseFilterModel;

  constructor(params: IFormBrowseModel) {
    this.results = params.results;
    this.pagination = params.pagination;
    this.filters = params.filters;
  }
}
