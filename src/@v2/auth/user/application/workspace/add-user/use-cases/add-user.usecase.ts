import { UserAggregateRepository } from '@/@v2/auth/user/database/repositories/user-aggregate/user-aggregate.repository';
import { UserAggregate } from '@/@v2/auth/user/domain/aggregate/user.aggregate';
import { UserEntity } from '@/@v2/auth/user/domain/entities/user.entity';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IAddUserUseCase } from './add-user.types';
import { AccessGroupRepository } from '@/@v2/auth/user/database/repositories/access-group/access-group.repository';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { LocalContext } from '@/@v2/shared/adapters/context';

@Injectable()
export class AddUserUseCase {
  constructor(
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly userAggregateRepository: UserAggregateRepository,
    private readonly accessGroupRepository: AccessGroupRepository,
  ) {}

  async execute(params: IAddUserUseCase.Params) {
    let user = await this.userAggregateRepository.findByEmail(params);

    if (user) {
      const profile = user.getProfile(params.companyId);
      if (profile) throw new BadRequestException('User already exists');
    }

    if (!user) {
      user = new UserAggregate({
        user: new UserEntity({
          email: params.email,
          cpf: params.cpf,
          name: params.name,
          phone: params.phone,
        }),
        profiles: [],
      });
    }

    const accessGroup = await this.accessGroupRepository.find({ id: params.groupId });

    // await this.statusRepository.create(status);
  }
}
