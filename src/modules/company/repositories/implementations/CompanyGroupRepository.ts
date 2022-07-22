/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import {
  FindCompanyGroupDto,
  UpsertCompanyGroupDto,
} from '../../dto/company-group.dto';
import { CompanyGroupEntity } from '../../entities/company-group.entity';

@Injectable()
export class CompanyGroupRepository {
  constructor(private prisma: PrismaService) {}

  async upsert({ id, companyId, companies, ...data }: UpsertCompanyGroupDto) {
    const accessGroup = await this.prisma.companyGroup.upsert({
      update: { ...data },
      create: { ...data, companyId },
      where: { id_companyId: { id: id || 0, companyId } },
    });

    return new CompanyGroupEntity(accessGroup);
  }

  async findById(
    id: number,
    companyId: string,
    options: Prisma.CompanyGroupFindFirstArgs = {},
  ) {
    const accessGroup = await this.prisma.companyGroup.findFirst({
      where: { companyId, id },
      ...options,
    });

    return new CompanyGroupEntity(accessGroup);
  }

  async findAvailable(
    companyId: string,
    query: Partial<FindCompanyGroupDto>,
    pagination: PaginationQueryDto,
    options: Prisma.CompanyGroupFindManyArgs = {},
  ) {
    const where = {
      AND: [{ OR: [{ companyId }, { system: true }] }],
    } as typeof options.where;

    if ('search' in query) {
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
      this.prisma.companyGroup.count({
        where,
      }),
      this.prisma.companyGroup.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      data: response[1].map((group) => new CompanyGroupEntity(group)),
      count: response[0],
    };
  }
}
