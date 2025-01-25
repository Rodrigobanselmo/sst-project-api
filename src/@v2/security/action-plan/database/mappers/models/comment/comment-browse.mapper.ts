import { CommentBrowseModel } from '@/@v2/security/action-plan/domain/models/comment/comment-browse.model';
import { IPaginationModelMapper, PaginationModelMapper } from '@/@v2/shared/utils/database/pagination-mapper';
import { CommentBrowseFilterModelMapper, ICommentBrowseFilterModelMapper } from './comment-browse-filter.mapper';
import { CommentBrowseResultModelMapper, ICommentBrowseResultModelMapper } from './comment-browse-result.mapper';

export type ICommentBrowseModelMapper = {
  results: ICommentBrowseResultModelMapper[];
  pagination: IPaginationModelMapper;
  filters: ICommentBrowseFilterModelMapper;
};

export class CommentBrowseModelMapper {
  static toModel(prisma: ICommentBrowseModelMapper): CommentBrowseModel {
    return new CommentBrowseModel({
      results: CommentBrowseResultModelMapper.toModels(prisma.results),
      pagination: PaginationModelMapper.toModel(prisma.pagination),
      filters: CommentBrowseFilterModelMapper.toModel(),
    });
  }
}
