import { User } from '@prisma/client';
import { IProfileEntityMapper, ProfileMapper } from '../entities/profile.mapper';
import { UserMapper } from '../entities/user.mapper';
import { ProfileAggregate } from '../../../domain/aggregate/profile.aggregate';

type IUserEntityMapper = IProfileEntityMapper & {
  user: User;
};

export class ProfileAggregateMapper {
  static toEntity(data: IUserEntityMapper): ProfileAggregate {
    return new ProfileAggregate({
      profile: ProfileMapper.toEntity(data),
      user: UserMapper.toEntity(data.user),
    });
  }
}
