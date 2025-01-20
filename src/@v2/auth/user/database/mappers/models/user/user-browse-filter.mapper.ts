import { UserBrowseFilterModel } from '@/@v2/auth/user/domain/models/user/user-browse-filter.model';

export type IUserBrowseFilterModelMapper = {};

export class UserBrowseFilterModelMapper {
  static toModel(prisma: IUserBrowseFilterModelMapper): UserBrowseFilterModel {
    return new UserBrowseFilterModel(prisma);
  }
}
