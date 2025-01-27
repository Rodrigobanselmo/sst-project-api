import { PaginationModel } from '@/@v2/shared/models/common/pagination.model';
import { ResponsibleBrowseResultModel } from './responsible-browse-result.model';

export type IResponsibleBrowseModel = {
  results: ResponsibleBrowseResultModel[];
  pagination: PaginationModel;
};

export class ResponsibleBrowseModel {
  results: ResponsibleBrowseResultModel[];
  pagination: PaginationModel;

  constructor(params: IResponsibleBrowseModel) {
    this.results = params.results;
    this.pagination = params.pagination;
  }
}
