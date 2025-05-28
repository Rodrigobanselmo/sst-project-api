import { PaginationModel } from '@/@v2/shared/models/common/pagination.model';
import { AbsenteeismTotalHierarchyFilterBrowseModel } from './absenteeism-total-hierarchy-browse-filter.model';
import { AbsenteeismTotalHierarchyResultBrowseModel } from './absenteeism-total-hierarchy-browse-result.model';

export type IAbsenteeismTotalHierarchyBrowseModel = {
  results: AbsenteeismTotalHierarchyResultBrowseModel[];
  pagination: PaginationModel;
  filters: AbsenteeismTotalHierarchyFilterBrowseModel;
};

export class AbsenteeismTotalHierarchyBrowseModel {
  results: AbsenteeismTotalHierarchyResultBrowseModel[];
  pagination: PaginationModel;
  filters: AbsenteeismTotalHierarchyFilterBrowseModel;

  constructor(params: IAbsenteeismTotalHierarchyBrowseModel) {
    this.results = params.results;
    this.pagination = params.pagination;
    this.filters = params.filters;
  }
}
