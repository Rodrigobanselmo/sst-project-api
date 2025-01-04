import { PaginationModel } from "@/@v2/shared/models/common/pagination.model";
import { ActionPlanBrowseFilterModel } from "./action-plan-browse-filter.model";
import { ActionPlanBrowseResultModel } from "./action-plan-browse-result.model";

export type IActionPlanBrowseModel = {
  results: ActionPlanBrowseResultModel[]
  pagination: PaginationModel
  filters: ActionPlanBrowseFilterModel
}

export class ActionPlanBrowseModel {
  results: ActionPlanBrowseResultModel[]
  pagination: PaginationModel
  filters: ActionPlanBrowseFilterModel

  constructor(params: IActionPlanBrowseModel) {
    this.results = params.results
    this.pagination = params.pagination
    this.filters = params.filters
  }
}