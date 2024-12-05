import { PaginationModel } from "@/@v2/shared/models/common/pagination.model";
import { HierarchyBrowseResultModel } from "./hierarchy-browse-result.model";
import { HierarchyBrowseShortResultModel } from "./hierarchy-browse-short-result.model";

export type IHierarchyBrowseShortModel = {
  results: HierarchyBrowseResultModel[]
  pagination: PaginationModel
}

export class HierarchyBrowseShortModel {
  results: HierarchyBrowseShortResultModel[]
  pagination: PaginationModel

  constructor(params: IHierarchyBrowseShortModel) {
    this.results = params.results
    this.pagination = params.pagination
  }
}

