import { User } from '@prisma/client';
import { UserAggregate } from '../../../domain/aggregate/user.aggregate';
import { IProfileEntityMapper, ProfileMapper } from '../entities/profile.mapper';
import { UserMapper } from '../entities/user.mapper';

type IUserEntityMapper = User & {
  companies: IProfileEntityMapper[];
};

export class UserAggregateMapper {
  static toEntity(data: IUserEntityMapper): UserAggregate {
    return new UserAggregate({
      user: UserMapper.toEntity(data),
      profiles: data.companies.map((profile) => ProfileMapper.toEntity(profile)),
    });
  }
}
