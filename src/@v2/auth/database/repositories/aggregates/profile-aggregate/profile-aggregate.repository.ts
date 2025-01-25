import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IProfileAggregateRepository } from './profile-aggregate.types';
import { ProfileAggregateMapper } from '../../../mappers/aggregates/profile-aggregate.mapper';

@Injectable()
export class ProfileAggregateRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {
      group: true,
      user: true,
    } satisfies Prisma.UserCompanyFindFirstArgs['include'];

    return { include };
  }

  async create(params: IProfileAggregateRepository.CreateParams): IProfileAggregateRepository.CreateReturn {
    const user = await this.prisma.userCompany.create({
      data: {
        companyId: params.profile.uuid.companyId,
        groupId: params.profile.accessGroup?.id,
        userId: params.user.id,
      },
      ...ProfileAggregateRepository.selectOptions(),
    });

    return user ? ProfileAggregateMapper.toEntity(user) : null;
  }

  async update(params: IProfileAggregateRepository.UpdateParams): IProfileAggregateRepository.UpdateReturn {
    const user = await this.prisma.userCompany.update({
      where: { companyId_userId: params.profile.uuid },
      data: {
        groupId: params.profile.accessGroup?.id,
      },
      ...ProfileAggregateRepository.selectOptions(),
    });

    return user ? ProfileAggregateMapper.toEntity(user) : null;
  }

  async find(params: IProfileAggregateRepository.FindParams): IProfileAggregateRepository.FindReturn {
    const user = await this.prisma.userCompany.findFirst({
      where: {
        companyId: params.companyId,
        userId: params.userId,
      },
      ...ProfileAggregateRepository.selectOptions(),
    });

    return user ? ProfileAggregateMapper.toEntity(user) : null;
  }
}
