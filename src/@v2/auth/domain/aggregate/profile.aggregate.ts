import { ProfileEntity } from '../entities/profile.entity';
import { UserEntity } from '../entities/user.entity';

export type IProfileAggregate = {
  profile: ProfileEntity;
  user: UserEntity;
};

export class ProfileAggregate {
  profile: ProfileEntity;
  user: UserEntity;

  constructor(params: IProfileAggregate) {
    this.user = params.user;
    this.profile = params.profile;
  }
}
