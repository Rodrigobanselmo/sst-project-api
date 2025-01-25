import { UserStatusEnum } from '@/@v2/auth/domain/enums/user-status.enum';
import { UserBrowseResultModel } from '@/@v2/auth/domain/models/user/user-browse-result.model';

export type IUserBrowseResultModelMapper = {
  id: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  name: string | null;
};

export class UserBrowseResultModelMapper {
  static toModel(prisma: IUserBrowseResultModelMapper): UserBrowseResultModel {
    return new UserBrowseResultModel({
      id: prisma.id,
      email: prisma.email,
      name: prisma.name || undefined,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
      status: UserStatusEnum.ACTIVE,
    });
  }

  static toModels(prisma: IUserBrowseResultModelMapper[]): UserBrowseResultModel[] {
    return prisma.map((rec) => UserBrowseResultModelMapper.toModel(rec));
  }
}
