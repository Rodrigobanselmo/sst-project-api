import { PaginationModel } from "@/@v2/shared/models/common/pagination.model";
import { CommentBrowseFilterModel } from "./comment-browse-filter.model";
import { CommentBrowseResultModel } from "./comment-browse-result.model";

export type ICommentBrowseModel = {
  results: CommentBrowseResultModel[]
  pagination: PaginationModel
  filters: CommentBrowseFilterModel
}

export class CommentBrowseModel {
  results: CommentBrowseResultModel[]
  pagination: PaginationModel
  filters: CommentBrowseFilterModel

  constructor(params: ICommentBrowseModel) {
    this.results = params.results
    this.pagination = params.pagination
    this.filters = params.filters
  }
}