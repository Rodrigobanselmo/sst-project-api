import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { CreateAbsenteeismDto, FindAbsenteeismDto, UpdateAbsenteeismDto } from '../../dto/absenteeism.dto';

import { AbsenteeismEntity } from '../../entities/absenteeism.entity';
import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';

@Injectable()
export class AbsenteeismRepository {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateAbsenteeismDto & { timeSpent: number }) {
    const absenteeism = await this.prisma.absenteeism.create({
      data: createCompanyDto,
    });

    return new AbsenteeismEntity(absenteeism);
  }

  async update({ id, ...createCompanyDto }: UpdateAbsenteeismDto & { timeSpent: number }) {
    const absenteeism = await this.prisma.absenteeism.update({
      data: createCompanyDto,
      where: { id },
    });

    return new AbsenteeismEntity(absenteeism);
  }

  async find(
    query: Partial<FindAbsenteeismDto>,
    pagination: PaginationQueryDto,
    options: Prisma.AbsenteeismFindManyArgs = {},
  ) {
    const whereInit = {
      AND: [],
    } as typeof options.where;

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search', 'companyId', 'companiesIds'],
    });

    if (!options.select)
      options.select = {
        id: true,
        employeeId: true,
        motive: true,
        esocial18: true,
        timeSpent: true,
        startDate: true,
        endDate: true,
        timeUnit: true,
        employee: {
          select: {
            name: true,
            cpf: true,
            id: true,
            companyId: true,
            company: { select: { id: true, name: true, initials: true, fantasy: true } },
          },
        },
      };

    if ('search' in query && query.search) {
      (where.AND as any).push({
        OR: [{ employee: { name: { contains: query.search, mode: 'insensitive' } } }],
      } as typeof options.where);
      delete query.search;
    }

    if ('companyId' in query) {
      (where.AND as any).push({
        employee: {
          OR: [
            {
              companyId: query.companyId,
            },
            {
              company: {
                receivingServiceContracts: {
                  some: { applyingServiceCompanyId: query.companyId },
                },
              },
            },
          ],
        },
      } as typeof options.where);
      delete query.companiesIds;
    }

    if ('companiesIds' in query) {
      (where.AND as any).push({
        companyId: { in: query.companiesIds },
      } as typeof options.where);
      delete query.companiesIds;
    }

    const response = await this.prisma.$transaction([
      this.prisma.absenteeism.count({
        where,
      }),
      this.prisma.absenteeism.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { startDate: 'desc' },
      }),
    ]);

    return {
      data: response[1].map((absenteeism) => new AbsenteeismEntity(absenteeism)),
      count: response[0],
    };
  }

  async findNude(options: Prisma.AbsenteeismFindManyArgs = {}) {
    const absenteeisms = await this.prisma.absenteeism.findMany({
      ...options,
    });

    return absenteeisms.map((absenteeism) => new AbsenteeismEntity(absenteeism));
  }

  async findFirstNude(options: Prisma.AbsenteeismFindFirstArgs = {}) {
    const absenteeism = await this.prisma.absenteeism.findFirst({
      ...options,
    });

    return new AbsenteeismEntity(absenteeism);
  }

  async findById({ companyId, id }: { companyId: string; id: number }, options: Prisma.AbsenteeismFindFirstArgs = {}) {
    const absenteeism = await this.prisma.absenteeism.findFirst({
      where: { id, employee: { companyId } },
      include: {
        esocial18: true,
        motive: true,
        doc: { include: { professional: { select: { name: true, id: true } } } },
        cid: true,
      },
      ...options,
    });

    return new AbsenteeismEntity(absenteeism);
  }

  async delete(id: number) {
    const absenteeism = await this.prisma.absenteeism.delete({
      where: { id },
    });

    return new AbsenteeismEntity(absenteeism);
  }
}
