import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IUserAggregateRepository } from './user-aggregate.types';
import { UserAggregateMapper } from '../../mappers/aggregates/user-aggregate.mapper';

@Injectable()
export class UserAggregateRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {
      companies: {
        include: {
          group: true,
        },
      },
    } satisfies Prisma.UserFindFirstArgs['include'];

    return { include };
  }

  async create(params: IUserAggregateRepository.CreateParams): IUserAggregateRepository.CreateReturn {
    const user = await this.prisma.user.create({
      data: {
        name: params.user.name,
        email: params.user.email,
      },
      ...UserAggregateRepository.selectOptions(),
    });

    return user ? UserAggregateMapper.toEntity(user) : null;
  }

  async update(params: IUserAggregateRepository.UpdateParams): IUserAggregateRepository.UpdateReturn {
    const user = await this.prisma.user.update({
      where: { id: params.user.id },
      data: {
        name: params.user.name,
      },
      ...UserAggregateRepository.selectOptions(),
    });

    return user ? UserAggregateMapper.toEntity(user) : null;
  }

  async find(params: IUserAggregateRepository.FindParams): IUserAggregateRepository.FindReturn {
    const user = await this.prisma.user.findFirst({
      where: {
        id: params.id,
        companies: {
          some: {
            companyId: params.companyId,
          },
        },
      },
      ...UserAggregateRepository.selectOptions(),
    });

    return user ? UserAggregateMapper.toEntity(user) : null;
  }

  async findByEmail(params: IUserAggregateRepository.FindByEmailParams): IUserAggregateRepository.FindReturn {
    const user = await this.prisma.user.findFirst({
      where: {
        email: params.email,
      },
      ...UserAggregateRepository.selectOptions(),
    });

    return user ? UserAggregateMapper.toEntity(user) : null;
  }
}
