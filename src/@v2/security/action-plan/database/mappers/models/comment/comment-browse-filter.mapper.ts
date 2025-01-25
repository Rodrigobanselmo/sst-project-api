import { CommentBrowseFilterModel } from '@/@v2/security/action-plan/domain/models/comment/comment-browse-filter.model';

export type ICommentBrowseFilterModelMapper = {};

export class CommentBrowseFilterModelMapper {
  static toModel(): CommentBrowseFilterModel {
    return new CommentBrowseFilterModel({});
  }
}
