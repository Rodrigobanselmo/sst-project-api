import { PaginationQueryDto } from './../../../../shared/dto/pagination.dto';
import { prismaFilter } from './../../../../shared/utils/filters/prisma.filters';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateGenerateSourceDto, FindGenerateSourceDto, UpdateGenerateSourceDto } from '../../dto/generate-source.dto';
import { GenerateSourceEntity } from '../../entities/generateSource.entity';
import { IGenerateSourceRepository } from '../IGenerateSourceRepository.types';

@Injectable()
export class GenerateSourceRepository implements IGenerateSourceRepository {
  constructor(private prisma: PrismaService) {}

  async create({ recMeds, ...createGenerateSourceDto }: CreateGenerateSourceDto, system: boolean): Promise<GenerateSourceEntity> {
    const hasRecMed = recMeds ? recMeds.filter(({ recName, medName }) => recName || medName).length > 0 : false;

    const redMed = await this.prisma.generateSource.create({
      data: {
        ...createGenerateSourceDto,
        system,
        recMeds: hasRecMed
          ? {
              createMany: {
                data: recMeds.map(({ ...rm }) => ({
                  system,
                  ...rm,
                  riskId: createGenerateSourceDto.riskId,
                  companyId: createGenerateSourceDto.companyId,
                })),
                skipDuplicates: true,
              },
            }
          : undefined,
      },
      include: { recMeds: true },
    });

    return new GenerateSourceEntity(redMed);
  }

  async update(
    { id, recMeds, riskId, ...createGenerateSourceDto }: UpdateGenerateSourceDto & { id: string; riskId?: string },
    system: boolean,
    companyId: string,
  ): Promise<GenerateSourceEntity> {
    const generateSource = await this.prisma.generateSource.update({
      data: {
        ...createGenerateSourceDto,
        recMeds: {
          upsert: !recMeds
            ? []
            : recMeds
                .filter(({ recName, medName }) => recName || medName)
                .map(({ id, ...rm }) => {
                  return {
                    create: { system, companyId, ...rm, riskId },
                    update: { system, ...rm, riskId },
                    where: { id: id || 'no-id' },
                  };
                }),
        },
      },
      where: { id_companyId: { companyId, id: id || 'no-id' } },
    });

    await Promise.all(
      recMeds
        .filter(({ id, recName, medName }) => id && !recName && !medName)
        .map(async ({ id: _id }) => {
          await this.prisma.generateSource.update({
            data: {
              ...createGenerateSourceDto,
              recMeds: {
                connect: { id_companyId: { companyId, id: _id || 'no-id' } },
              },
            },
            where: { id_companyId: { companyId, id: id || 'no-id' } },
          });
        }),
    );

    return new GenerateSourceEntity(generateSource);
  }

  async findById(id: string, companyId: string): Promise<GenerateSourceEntity> {
    const generate = await this.prisma.generateSource.findUnique({
      where: { id_companyId: { id, companyId } },
    });

    return new GenerateSourceEntity(generate);
  }

  async DeleteByCompanyAndIdSoft(id: string, companyId: string): Promise<GenerateSourceEntity> {
    const generate = await this.prisma.generateSource.update({
      where: { id_companyId: { id, companyId } },
      data: { deleted_at: new Date() },
    });

    return new GenerateSourceEntity(generate);
  }

  async DeleteByIdSoft(id: string): Promise<GenerateSourceEntity> {
    const generate = await this.prisma.generateSource.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    return new GenerateSourceEntity(generate);
  }

  async find(query: Partial<FindGenerateSourceDto>, pagination: PaginationQueryDto, options: Prisma.GenerateSourceFindManyArgs = {}) {
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
      skip: ['search', 'companyId', 'riskIds'],
    });

    if ('riskIds' in query) {
      (where.AND as any).push({
        riskId: { in: query.riskIds },
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

    if ('search' in query) {
      const OR = [] as any[];

      OR.push({ name: { contains: query.search, mode: 'insensitive' } });

      (where.AND as any).push({
        OR,
      } as typeof options.where);
    }

    const response = await this.prisma.$transaction([
      this.prisma.generateSource.count({
        where,
      }),
      this.prisma.generateSource.findMany({
        where,
        include: Object.keys(include).length > 0 ? include : undefined,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      data: response[1].map((generateSource) => new GenerateSourceEntity(generateSource)),
      count: response[0],
    };
  }

  async findNude(options: Prisma.GenerateSourceFindManyArgs = {}) {
    const response = await this.prisma.$transaction([
      this.prisma.generateSource.count({
        where: options.where,
      }),
      this.prisma.generateSource.findMany({
        ...options,
      }),
    ]);

    return {
      data: response[1].map((recMed) => new GenerateSourceEntity(recMed)),
      count: response[0],
    };
  }
}
