import { UserBrowseModel } from '@/@v2/auth/domain/models/user/user-browse.model';
import { IUserBrowseFilterModelMapper, UserBrowseFilterModelMapper } from './user-browse-filter.mapper';
import { IUserBrowseResultModelMapper, UserBrowseResultModelMapper } from './user-browse-result.mapper';
import { IPaginationModelMapper, PaginationModelMapper } from '@/@v2/shared/utils/database/pagination-mapper';

export type IUserBrowseModelMapper = {
  results: IUserBrowseResultModelMapper[];
  pagination: IPaginationModelMapper;
  filters: IUserBrowseFilterModelMapper;
};

export class UserBrowseModelMapper {
  static toModel(prisma: IUserBrowseModelMapper): UserBrowseModel {
    return new UserBrowseModel({
      results: UserBrowseResultModelMapper.toModels(prisma.results),
      pagination: PaginationModelMapper.toModel(prisma.pagination),
      filters: UserBrowseFilterModelMapper.toModel(prisma.filters),
    });
  }
}
