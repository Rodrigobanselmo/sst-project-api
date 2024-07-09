/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { FindAccessGroupDto, UpsertAccessGroupDto } from '../../dto/access-group.dto';
import { AccessGroupsEntity } from '../../entities/access-groups.entity';

@Injectable()
export class AuthGroupRepository {
  constructor(private prisma: PrismaService) {}

  async upsert({ id, companyId, ...data }: UpsertAccessGroupDto, system: boolean) {
    const accessGroup = await this.prisma.accessGroups.upsert({
      update: { ...data, system },
      create: { ...data, system, companyId },
      where: { id_companyId: { id: id || 0, companyId } },
    });

    return new AccessGroupsEntity(accessGroup);
  }

  async findById(id: number, companyId: string, options: Prisma.AccessGroupsFindFirstArgs = {}) {
    const accessGroup = await this.prisma.accessGroups.findFirst({
      where: {
        OR: [
          { companyId, id },
          { system: true, id },
        ],
      },
      ...options,
    });

    return new AccessGroupsEntity(accessGroup);
  }

  async findAvailable(
    companyId: string,
    query: Partial<FindAccessGroupDto>,
    pagination: PaginationQueryDto,
    options: Prisma.AccessGroupsFindManyArgs = {},
  ) {
    const where = {
      AND: [{ OR: [{ companyId }, { system: true }] }],
    } as typeof options.where;

    if ('search' in query && query.search) {
      (where.AND as any).push({
        OR: [{ name: { contains: query.search, mode: 'insensitive' } }],
      } as typeof options.where);
      delete query.search;
    }

    Object.entries(query).forEach(([key, value]) => {
      if (value)
        (where.AND as any).push({
          [key]: {
            contains: value,
            mode: 'insensitive',
          },
        } as typeof options.where);
    });

    const response = await this.prisma.$transaction([
      this.prisma.accessGroups.count({
        where,
      }),
      this.prisma.accessGroups.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      data: response[1].map((group) => new AccessGroupsEntity(group)),
      count: response[0],
    };
  }
}
