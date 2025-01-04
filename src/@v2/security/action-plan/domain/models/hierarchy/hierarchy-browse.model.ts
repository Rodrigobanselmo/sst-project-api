import { PaginationModel } from "@/@v2/shared/models/common/pagination.model";
import { HierarchyBrowseResultModel } from "./hierarchy-browse-result.model";

export type IHierarchyBrowseModel = {
  results: HierarchyBrowseResultModel[]
  pagination: PaginationModel
}

export class HierarchyBrowseModel {
  results: HierarchyBrowseResultModel[]
  pagination: PaginationModel

  constructor(params: IHierarchyBrowseModel) {
    this.results = params.results
    this.pagination = params.pagination
  }
}

