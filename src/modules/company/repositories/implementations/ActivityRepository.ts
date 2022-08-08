import { prismaFilter } from './../../../../shared/utils/filters/prisma.filters';
import { PaginationQueryDto } from './../../../../shared/dto/pagination.dto';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { ActivityDto, FindActivityDto } from '../../dto/activity.dto';
import { ActivityEntity } from '../../entities/activity.entity';
import { Prisma } from '@prisma/client';

let i = 0;

@Injectable()
export class ActivityRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const activities = await this.prisma.activity.findMany();
    if (!activities) return;
    return activities.map((activity) => new ActivityEntity(activity));
  }

  async upsertMany(activitiesDto: ActivityDto[]) {
    i++;
    console.log('batch' + i);
    const data = await this.prisma.$transaction(
      activitiesDto.map(({ code, ...activityDto }) =>
        this.prisma.activity.upsert({
          where: { code },
          create: {
            ...activityDto,
            code,
          },
          update: activityDto,
        }),
      ),
    );

    return data.map((activity) => new ActivityEntity(activity));
  }

  async find(
    query: Partial<FindActivityDto>,
    pagination: PaginationQueryDto,
    options: Prisma.ActivityFindManyArgs = {},
  ) {
    const whereInit = {
      AND: [],
    } as typeof options.where;

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search'],
    });

    if ('search' in query) {
      (where.AND as any).push({
        OR: [
          // { name: { contains: query.search, mode: 'insensitive' } },
          { code: { contains: query.search } },
        ],
      } as typeof options.where);
    }

    const response = await this.prisma.$transaction([
      this.prisma.activity.count({
        where,
      }),
      this.prisma.activity.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      data: response[1].map((contact) => new ActivityEntity(contact)),
      count: response[0],
    };
  }
}
