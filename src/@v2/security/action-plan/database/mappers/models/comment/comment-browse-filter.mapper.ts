import { CommentBrowseFilterModel } from "@/@v2/security/action-plan/domain/models/comment/comment-browse-filter.model"

export type ICommentBrowseFilterModelMapper = {
}

export class CommentBrowseFilterModelMapper {
  static toModel(prisma: ICommentBrowseFilterModelMapper): CommentBrowseFilterModel {
    return new CommentBrowseFilterModel({

    })
  }
}
