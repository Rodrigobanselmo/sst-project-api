import { PaginationModel } from '@/@v2/shared/models/common/pagination.model';
import { FormBrowseResultModel } from './components/form-browse-result.model';
import { FormBrowseFilterModel } from './components/form-browse-filter.model';

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
