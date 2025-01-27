import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IProfileAggregateRepository } from './profile-aggregate.types';
import { ProfileAggregateMapper } from '../../../mappers/aggregates/profile-aggregate.mapper';

@Injectable()
export class ProfileAggregateRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions(options: IProfileAggregateRepository.SelectOptionsParams) {
    const include = {
      group: true,
      user: {
        include: {
          Employee: {
            where: { companyId: options.companyId },
            select: {
              id: true,
            },
          },
        },
      },
    } satisfies Prisma.UserCompanyFindFirstArgs['include'];

    return { include };
  }

  async create(params: IProfileAggregateRepository.CreateParams): IProfileAggregateRepository.CreateReturn {
    const [user] = await this.prisma.$transaction([
      this.prisma.userCompany.create({
        data: {
          companyId: params.profile.uuid.companyId,
          groupId: params.profile.accessGroup?.id,
          userId: params.user.id,
        },
        ...ProfileAggregateRepository.selectOptions(params.profile.uuid),
      }),
      ...(params.employee?.id
        ? [
            this.prisma.employee.update({
              where: { id: params.employee.id },
              data: {
                user_id: params.profile.uuid.userId,
              },
            }),
          ]
        : []),
    ]);

    return user ? ProfileAggregateMapper.toEntity(user) : null;
  }

  async update(params: IProfileAggregateRepository.UpdateParams): IProfileAggregateRepository.UpdateReturn {
    const [user] = await this.prisma.$transaction([
      this.prisma.userCompany.update({
        where: { companyId_userId: params.profile.uuid },
        data: {
          groupId: params.profile.accessGroup?.id,
        },
        ...ProfileAggregateRepository.selectOptions(params.profile.uuid),
      }),
      ...(params.employee?.id
        ? [
            this.prisma.employee.update({
              where: { id: params.employee.id },
              data: {
                user_id: params.profile.uuid.userId,
              },
            }),
          ]
        : []),
    ]);

    return user ? ProfileAggregateMapper.toEntity(user) : null;
  }

  async find(params: IProfileAggregateRepository.FindParams): IProfileAggregateRepository.FindReturn {
    const user = await this.prisma.userCompany.findFirst({
      where: {
        companyId: params.companyId,
        userId: params.userId,
      },
      ...ProfileAggregateRepository.selectOptions(params),
    });

    return user ? ProfileAggregateMapper.toEntity(user) : null;
  }
}
