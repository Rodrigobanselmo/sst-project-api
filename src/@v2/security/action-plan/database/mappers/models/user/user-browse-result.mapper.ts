import { UserBrowseResultModel } from '@/@v2/security/action-plan/domain/models/user/user-browse-result.model';

export type IUserBrowseResultModelMapper = {
  user_id: number;
  user_name: string | null;
  user_email: string | null;
};

export class UserBrowseResultModelMapper {
  static toModel(prisma: IUserBrowseResultModelMapper): UserBrowseResultModel {
    return new UserBrowseResultModel({
      id: prisma.user_id,
      name: prisma.user_name || '',
      email: prisma.user_email || undefined,
    });
  }

  static toModels(prisma: IUserBrowseResultModelMapper[]): UserBrowseResultModel[] {
    return prisma.map((rec) => UserBrowseResultModelMapper.toModel(rec));
  }
}
