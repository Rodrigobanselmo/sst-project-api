import { BadRequestException } from '@nestjs/common';
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

  get new() {
    return this.user.id === -1;
  }

  getProfile(companyId: string) {
    return this.profiles.find((profile) => profile.uuid.companyId === companyId);
  }

  getNewProfiles() {
    return this.profiles.filter((profile) => profile.new);
  }

  addProfile(profile: ProfileEntity) {
    const foundProfile = this.getProfile(profile.uuid.companyId);
    if (foundProfile) throw new BadRequestException('Usuário já cadastrado');

    this.profiles.push(profile);
  }
}
