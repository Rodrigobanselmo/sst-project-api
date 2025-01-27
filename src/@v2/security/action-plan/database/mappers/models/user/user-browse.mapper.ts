import { UserBrowseModel } from '@/@v2/security/action-plan/domain/models/user/user-browse.model';
import { IPaginationModelMapper, PaginationModelMapper } from '@/@v2/shared/utils/database/pagination-mapper';
import { IUserBrowseResultModelMapper, UserBrowseResultModelMapper } from './user-browse-result.mapper';

export type IUserBrowseModelMapper = {
  results: IUserBrowseResultModelMapper[];
  pagination: IPaginationModelMapper;
};

export class UserBrowseModelMapper {
  static toModel(prisma: IUserBrowseModelMapper): UserBrowseModel {
    return new UserBrowseModel({
      results: UserBrowseResultModelMapper.toModels(prisma.results),
      pagination: PaginationModelMapper.toModel(prisma.pagination),
    });
  }
}
