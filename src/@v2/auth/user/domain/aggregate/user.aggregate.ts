import { ProfileEntity } from '../entities/profile.entity';
import { UserEntity } from '../entities/user.entity';

export type IUserAggregate = {
  user: UserEntity;
  profiles: ProfileEntity[];
};

export class UserAggregate {
  user: UserEntity;
  profiles: ProfileEntity[];

  constructor(params: IUserAggregate) {
    this.user = params.user;
    this.profiles = params.profiles;
  }

  getProfile(companyId: string) {
    return this.profiles.find((profile) => profile.uuid.companyId === companyId);
  }
}
