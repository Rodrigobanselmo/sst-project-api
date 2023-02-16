import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { DayJSProvider } from '../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';
import { CreateScheduleBlockDto, FindScheduleBlockDto, UpdateScheduleBlockDto } from '../../dto/schedule-block';
import { ScheduleBlockEntity } from '../../entities/schedule-block.entity';
import { normalizeString } from '../../../../shared/utils/normalizeString';

@Injectable()
export class ScheduleBlockRepository {
  constructor(private prisma: PrismaService, private dayjsProvider: DayJSProvider) {}

  async create({ companyId, name, startDate, endDate, companiesIds, yearRecurrence, ...data }: CreateScheduleBlockDto) {
    const scheduleBlock = await this.prisma.scheduleBlock.create({
      data: {
        ...data,
        name: normalizeString(name),
        yearRecurrence,
        startDate: this.dayjsProvider.format(startDate, yearRecurrence ? 'MM-DD' : 'YYYY-MM-DD'),
        endDate: this.dayjsProvider.format(endDate, yearRecurrence ? 'MM-DD' : 'YYYY-MM-DD'),
        companyId,
        applyOnCompanies: {
          connect: companiesIds.map((id) => ({
            id,
          })),
        },
      },
    });

    return new ScheduleBlockEntity(scheduleBlock);
  }

  async update({ id, name, yearRecurrence, startDate, endDate, companiesIds, companyId, ...data }: UpdateScheduleBlockDto) {
    const scheduleBlock = await this.prisma.scheduleBlock.update({
      data: {
        ...data,
        name: normalizeString(name),
        yearRecurrence,
        startDate: this.dayjsProvider.format(startDate, yearRecurrence ? 'MM-DD' : 'YYYY-MM-DD'),
        endDate: this.dayjsProvider.format(endDate, yearRecurrence ? 'MM-DD' : 'YYYY-MM-DD'),
        companyId,
        applyOnCompanies: {
          set: companiesIds.map((id) => ({
            id,
          })),
        },
      },
      where: { id },
    });

    return new ScheduleBlockEntity(scheduleBlock);
  }

  async find(query: Partial<FindScheduleBlockDto>, pagination: PaginationQueryDto, options: Prisma.ScheduleBlockFindManyArgs = {}) {
    const whereInit = {
      AND: [],
    } as typeof options.where;

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search', 'companyId'],
    });

    if (!options.select)
      options.select = {
        id: true,
        status: true,
        startDate: true,
        endDate: true,
        startTime: true,
        endTime: true,
        yearRecurrence: true,
        name: true,
        // description: true,
        type: true,
        allCompanies: true,
      };

    if ('search' in query) {
      (where.AND as any).push({
        name: { contains: query.search, mode: 'insensitive' },
      } as typeof options.where);
    }

    if ('companyId' in query) {
      (where.AND as any).push({
        OR: [
          // {
          //   allCompanies: true,
          //   company: {
          //     applyingServiceContracts: {
          //       some: { receivingServiceCompanyId: query.companyId },
          //     },
          //   },
          // },
          {
            company: {
              receivingServiceContracts: {
                some: { applyingServiceCompanyId: query.companyId },
              },
            },
          },
          {
            companyId: query.companyId,
          },
          { applyOnCompanies: { some: { id: query.companyId } } },
        ],
      } as typeof options.where);
    }

    const response = await this.prisma.$transaction([
      this.prisma.scheduleBlock.count({
        where,
      }),
      this.prisma.scheduleBlock.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      data: response[1].map((scheduleBlock) => new ScheduleBlockEntity(scheduleBlock)),
      count: response[0],
    };
  }

  async findNude(options: Prisma.ScheduleBlockFindManyArgs = {}) {
    const scheduleBlocks = await this.prisma.scheduleBlock.findMany({
      ...options,
    });

    return scheduleBlocks.map((scheduleBlock) => new ScheduleBlockEntity(scheduleBlock));
  }

  async countNude(options: Prisma.ScheduleBlockCountArgs = {}) {
    const count = await this.prisma.scheduleBlock.count({
      ...options,
    });

    return count;
  }

  async findById({ companyId, id }: { companyId: string; id: number }, options: Prisma.ScheduleBlockFindFirstArgs = {}) {
    const scheduleBlock = await this.prisma.scheduleBlock.findFirst({
      where: { id, companyId },
      include: {
        applyOnCompanies: { where: { status: 'ACTIVE' }, select: { cnpj: true, fantasy: true, name: true, initials: true, id: true } },
      },
      ...options,
    });

    return new ScheduleBlockEntity(scheduleBlock as any);
  }

  async findFirstNude(options: Prisma.ScheduleBlockFindFirstArgs = {}) {
    const scheduleBlock = await this.prisma.scheduleBlock.findFirst({
      ...options,
    });

    return new ScheduleBlockEntity(scheduleBlock);
  }

  async delete(id: number) {
    const scheduleBlock = await this.prisma.scheduleBlock.delete({
      where: { id },
    });

    return new ScheduleBlockEntity(scheduleBlock);
  }
}
