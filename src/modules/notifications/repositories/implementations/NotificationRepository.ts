import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';
import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';

import { PrismaService } from '../../../../prisma/prisma.service';

import { Prisma } from '@prisma/client';
import { NotificationEntity } from '../../entities/notification.entity';
import { CreateNotificationDto, FindNotificationDto, UpdateNotificationDto, UpdateUserNotificationDto } from '../../dto/nofication.dto';
import dayjs from 'dayjs';

@Injectable()
export class NotificationRepository {
  constructor(private prisma: PrismaService) { }

  async create({
    companiesIds,
    usersIds,
    json,
    ...createNotificationDto
  }: CreateNotificationDto & {
    system?: boolean;
    companyId: string;
  }): Promise<NotificationEntity> {
    const notification = await this.prisma.notification.create({
      data: {
        ...createNotificationDto,
        json: json as any,
        companies: companiesIds ? { connect: companiesIds.map((id) => ({ id })) } : undefined,
        users: usersIds ? { connect: usersIds.map((id) => ({ id })) } : undefined,
      },
    });

    return new NotificationEntity(notification);
  }

  async update({ id, companiesIds, usersIds, json, ...createNotificationDto }: UpdateNotificationDto): Promise<NotificationEntity> {
    const notification = await this.prisma.notification.update({
      data: {
        ...createNotificationDto,
        json: json as any,
        companies: companiesIds ? { set: companiesIds.map((id) => ({ id })) } : undefined,
        users: usersIds ? { set: usersIds.map((id) => ({ id })) } : undefined,
      },
      where: { id },
    });

    return new NotificationEntity(notification);
  }

  async confirm({ userId, id }: UpdateUserNotificationDto): Promise<NotificationEntity> {
    const notification = await this.prisma.notification.update({
      data: {
        confirmations: { connect: { id: userId } },
      },
      where: { id },
    });

    return new NotificationEntity(notification);
  }

  async confirmMany({ userId, ids }: UpdateUserNotificationDto) {
    const data = await this.prisma.$transaction(
      ids.map((id) =>
        this.prisma.notification.update({
          data: {
            confirmations: { connect: { id: userId } },
          },
          where: { id },
        }),
      ),
    );

    return data.map((exam) => new NotificationEntity(exam));
  }

  async find(query: Partial<FindNotificationDto> & { userId: number }, pagination: PaginationQueryDto, options: Prisma.NotificationFindManyArgs = {}) {
    const whereInit = {
      AND: [],
      ...options.where,
    } as typeof options.where;

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['usersIds', 'userId', 'companiesIds', 'isUnread', 'isCompany', 'isConsulting', 'isClinic'],
    });

    if ('usersIds' in query) {
      (where.AND as any).push({
        users: { some: { id: { in: query.usersIds } } },
      } as typeof options.where);
    }

    if ('companiesIds' in query) {
      (where.AND as any).push({
        companies: { some: { id: { in: query.companiesIds } } },
      } as typeof options.where);
    }

    if ('isUnread' in query) {
      (where.AND as any).push({
        confirmations: { some: { id: { not: query.userId } } },
      } as typeof options.where);
    }

    if ('isConsulting' in query || 'isClinic' in query || 'isCompany' in query) {
      const OrData: Partial<Prisma.NotificationWhereInput>[] = [];
      if (query.isConsulting) OrData.push({ isConsulting: query.isConsulting });
      if (query.isClinic) OrData.push({ isClinic: query.isClinic });
      if (query.isCompany) OrData.push({ isCompany: query.isCompany });

      if (OrData.length)
        (where.AND as any).push({
          OR: OrData
        } as typeof options.where);
    }

    const response = await this.prisma.$transaction([
      this.prisma.notification.count({
        where,
      }),
      this.prisma.notification.count({
        where: {
          AND: [{
            ...where,
          }, {
            OR: [
              {
                created_at: { lte: dayjs().add(-14, 'day').toDate() },
              },
              {
                confirmations: { some: { id: query.userId } },
              },
            ],

          }]
        },
      }),
      this.prisma.notification.findMany({
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { created_at: 'desc' },
        ...options,
        where,
      }),
    ]);

    const allCount = response[0]
    const ignoredCount = response[1]
    const data = response[2]

    return {
      data: data.map((exam) => new NotificationEntity(exam)),
      countUnread: allCount > ignoredCount ? allCount - ignoredCount : 0,
      count: allCount,
    };
  }

  async findCountNude(options: Prisma.NotificationFindManyArgs = {}) {
    const response = await this.prisma.$transaction([
      this.prisma.notification.count({
        where: options.where,
      }),
      this.prisma.notification.findMany({
        ...options,
      }),
    ]);

    return {
      data: response[1].map((exam) => new NotificationEntity(exam)),
      count: response[0],
    };
  }

  async findNude(options: Prisma.NotificationFindManyArgs = {}): Promise<NotificationEntity[]> {
    const notification = await this.prisma.notification.findMany(options);

    return notification.map((exam) => new NotificationEntity(exam));
  }

  async findFirstNude(options: Prisma.NotificationFindFirstArgs = {}): Promise<NotificationEntity> {
    const notification = await this.prisma.notification.findFirst(options);

    return new NotificationEntity(notification);
  }
}
