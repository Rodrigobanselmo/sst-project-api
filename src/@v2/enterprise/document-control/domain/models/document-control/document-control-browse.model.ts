import { PaginationModel } from '@/@v2/shared/models/common/pagination.model';
import { DocumentControlBrowseFilterModel } from './document-control-browse-filter.model';
import { DocumentControlBrowseResultModel } from './document-control-browse-result.model';

export type IDocumentControlBrowseModel = {
  pagination: PaginationModel;
  results: DocumentControlBrowseResultModel[];
  filters: DocumentControlBrowseFilterModel;
};

export class DocumentControlBrowseModel {
  results: DocumentControlBrowseResultModel[];
  pagination: PaginationModel;
  filters: DocumentControlBrowseFilterModel;

  constructor(params: IDocumentControlBrowseModel) {
    this.results = params.results;
    this.pagination = params.pagination;
    this.filters = params.filters;
  }
}
