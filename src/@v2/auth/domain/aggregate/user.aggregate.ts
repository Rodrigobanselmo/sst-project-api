import { DomainResponse } from '@/@v2/shared/domain/types/shared/domain-response';
import { ProfileEntity } from '../entities/profile.entity';
import { UserEntity } from '../entities/user.entity';
import { errorUserAlreadyCreated } from '../errors/domain.errors';

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

  get new() {
    return this.user.id === -1;
  }

  getProfile(companyId: string) {
    return this.profiles.find((profile) => profile.uuid.companyId === companyId);
  }

  getNewProfiles() {
    return this.profiles.filter((profile) => profile.new);
  }

  addProfile(profile: ProfileEntity): DomainResponse {
    const foundProfile = this.getProfile(profile.uuid.companyId);
    if (foundProfile) return [, errorUserAlreadyCreated];

    this.profiles.push(profile);
    return [, null];
  }
}
