import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';

import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';
import { FindCidDto } from '../../dto/cid.dto';
import { CidEntity } from '../../entities/cid.entity';

@Injectable()
export class CidRepository {
  constructor(private prisma: PrismaService) {}

  async find(
    query: Partial<FindCidDto>,
    pagination: PaginationQueryDto,
    options: Prisma.CidFindManyArgs = {},
  ) {
    const whereInit = {
      AND: [],
    } as typeof options.where;

    const { where } = prismaFilter(whereInit, {
      query,
      skip: [],
    });

    const response = await this.prisma.$transaction([
      this.prisma.cid.count({
        where,
      }),
      this.prisma.cid.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { cid: 'asc' },
      }),
    ]);

    return {
      data: response[1].map((data) => new CidEntity(data)),
      count: response[0],
    };
  }

  async findNude(options: Prisma.CidFindManyArgs = {}) {
    const data = await this.prisma.cid.findMany({
      ...options,
    });

    return data.map((data) => new CidEntity(data));
  }

  async findFirstNude(options: Prisma.CidFindFirstArgs = {}) {
    const data = await this.prisma.cid.findFirst({
      ...options,
    });

    return new CidEntity(data);
  }
}