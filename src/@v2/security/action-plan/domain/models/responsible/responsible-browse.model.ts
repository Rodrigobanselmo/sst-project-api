import { PaginationModel } from "@/@v2/shared/models/common/pagination.model";
import { ResponsibleBrowseFilterModel } from "./responsible-browse-filter.model";
import { ResponsibleBrowseResultModel } from "./responsible-browse-result.model";

export type IResponsibleBrowseModel = {
  results: ResponsibleBrowseResultModel[]
  pagination: PaginationModel
  filters: ResponsibleBrowseFilterModel
}

export class ResponsibleBrowseModel {
  results: ResponsibleBrowseResultModel[]
  pagination: PaginationModel
  filters: ResponsibleBrowseFilterModel

  constructor(params: IResponsibleBrowseModel) {
    this.results = params.results
    this.pagination = params.pagination
    this.filters = params.filters
  }
}