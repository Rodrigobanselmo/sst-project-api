import { PaginationQueryDto } from './../../../../shared/dto/pagination.dto';
import { prismaFilter } from './../../../../shared/utils/filters/prisma.filters';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateRecMedDto, FindRecMedDto, UpdateRecMedDto } from '../../dto/rec-med.dto';
import { RecMedEntity } from '../../entities/recMed.entity';
import { IRecMedRepository } from '../IRecMedRepository.types';
import { Prisma } from '@prisma/client';

@Injectable()
export class RecMedRepository implements IRecMedRepository {
  constructor(private prisma: PrismaService) {}

  async create(createRecMedDto: CreateRecMedDto, system: boolean): Promise<RecMedEntity> {
    const redMed = await this.prisma.recMed.create({
      data: {
        ...createRecMedDto,
        system,
      },
    });

    return new RecMedEntity(redMed);
  }

  async update({ id, ...createRecMedDto }: UpdateRecMedDto & { id: string }, companyId: string): Promise<RecMedEntity> {
    const recMed = await this.prisma.recMed.update({
      data: {
        ...createRecMedDto,
      },
      where: { id_companyId: { companyId, id: id || 'no-id' } },
    });

    return new RecMedEntity(recMed);
  }

  async DeleteByCompanyAndIdSoft(id: string, companyId: string): Promise<RecMedEntity> {
    const recMed = await this.prisma.recMed.update({
      where: { id_companyId: { id, companyId } },
      data: { deleted_at: new Date() },
    });

    return new RecMedEntity(recMed);
  }

  async DeleteByIdSoft(id: string): Promise<RecMedEntity> {
    const recMed = await this.prisma.recMed.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    return new RecMedEntity(recMed);
  }

  async find(query: Partial<FindRecMedDto>, pagination: PaginationQueryDto, options: Prisma.RecMedFindManyArgs = {}) {
    const whereInit = {
      AND: [
        {
          deleted_at: null,
        },
      ],
      ...options.where,
    } as typeof options.where;
    const include = { ...options?.include };

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search', 'onlyMed', 'onlyRec', 'companyId', 'riskIds', 'representAll'],
    });

    if ('riskIds' in query) {
      (where.AND as any).push({
        OR: [
          {
            riskId: { in: query.riskIds },
          },
          ...(query?.representAll
            ? [
                {
                  risk: { representAll: true },
                },
              ]
            : []),
        ],
      } as typeof options.where);
    }

    if ('onlyRec' in query) {
      (where.AND as any).push({
        AND: [{ recName: { not: null } }, { recName: { not: '' } }],
      } as typeof options.where);
    }

    if ('onlyMed' in query) {
      (where.AND as any).push({
        AND: [{ medName: { not: null } }, { medName: { not: '' } }],
      } as typeof options.where);
    }

    if ('companyId' in query) {
      (where.AND as any).push({
        OR: [
          { companyId: query.companyId },
          {
            company: {
              applyingServiceContracts: {
                some: { receivingServiceCompanyId: query.companyId },
              },
            },
          },
          { system: true },
        ],
      } as typeof options.where);
    }

    if ('search' in query && query.search) {
      const OR = [] as any[];

      !query.onlyMed && OR.push({ recName: { contains: query.search, mode: 'insensitive' } });
      !query.onlyRec && OR.push({ medName: { contains: query.search, mode: 'insensitive' } });

      (where.AND as any).push({
        OR,
      } as typeof options.where);
    }

    const response = await this.prisma.$transaction([
      this.prisma.recMed.count({
        where,
      }),
      this.prisma.recMed.findMany({
        where,
        include: Object.keys(include).length > 0 ? include : undefined,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: [{ recName: 'asc' }, { medName: 'asc' }],
      }),
    ]);

    return {
      data: response[1].map((recMed) => new RecMedEntity(recMed)),
      count: response[0],
    };
  }

  async findNude(options: Prisma.RecMedFindManyArgs = {}) {
    const response = await this.prisma.$transaction([
      this.prisma.recMed.count({
        where: options.where,
      }),
      this.prisma.recMed.findMany({
        ...options,
      }),
    ]);

    return {
      data: response[1].map((recMed) => new RecMedEntity(recMed)),
      count: response[0],
    };
  }
}
