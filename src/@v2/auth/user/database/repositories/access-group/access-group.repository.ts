import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IAccessGroupRepository } from './access-group.types';
import { AccessGroupMapper } from '../../mappers/entities/access-group.mapper';

@Injectable()
export class AccessGroupRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {} satisfies Prisma.AccessGroupsFindFirstArgs['include'];

    return { include };
  }

  async create(params: IAccessGroupRepository.CreateParams): IAccessGroupRepository.CreateReturn {
    const accessGroup = await this.prisma.accessGroups.create({
      data: {
        roles: params.roles,
        permissions: params.permissions,
        name: '',
        companyId: '',
      },
    });

    return accessGroup ? AccessGroupMapper.toEntity(accessGroup) : null;
  }

  async update(params: IAccessGroupRepository.UpdateParams): IAccessGroupRepository.UpdateReturn {
    const accessGroup = await this.prisma.accessGroups.update({
      where: { id: params.id },
      data: {
        roles: params.roles,
        permissions: params.permissions,
      },
    });

    return accessGroup ? AccessGroupMapper.toEntity(accessGroup) : null;
  }

  async find(params: IAccessGroupRepository.FindParams): IAccessGroupRepository.FindReturn {
    const accessGroup = await this.prisma.accessGroups.findFirst({
      where: { id: params.id },
      ...AccessGroupRepository.selectOptions(),
    });

    return accessGroup ? AccessGroupMapper.toEntity(accessGroup) : null;
  }
}
