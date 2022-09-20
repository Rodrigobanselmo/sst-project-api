import { prismaFilter } from './../../../../shared/utils/filters/prisma.filters';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { removeDuplicate } from '../../../../shared/utils/removeDuplicate';

import { PrismaService } from '../../../../prisma/prisma.service';
import { IPrismaOptions } from '../../../../shared/interfaces/prisma-options.types';
import {
  CreateRiskDto,
  FindRiskDto,
  UpdateRiskDto,
  UpsertRiskDto,
} from '../../dto/risk.dto';
import { RiskFactorsEntity } from '../../entities/risk.entity';
import { IRiskRepository } from '../IRiskRepository.types';
import { PaginationQueryDto } from 'src/shared/dto/pagination.dto';

@Injectable()
export class RiskRepository implements IRiskRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    { recMed, generateSource, ...createRiskDto }: CreateRiskDto,
    system: boolean,
  ): Promise<RiskFactorsEntity> {
    const risk = await this.prisma.riskFactors.create({
      data: {
        ...createRiskDto,
        system,
        recMed: {
          createMany: {
            data: recMed
              ? recMed.map(({ ...rm }) => ({
                  system,
                  companyId: createRiskDto.companyId,
                  ...rm,
                }))
              : [],
            skipDuplicates: true,
          },
        },
        generateSource: {
          createMany: {
            data: generateSource
              ? generateSource.map(({ ...gs }) => ({
                  system,
                  companyId: createRiskDto.companyId,
                  ...gs,
                }))
              : [],
            skipDuplicates: true,
          },
        },
      },
      include: { recMed: true, generateSource: true },
    });

    return new RiskFactorsEntity(risk);
  }

  async update(
    { recMed, generateSource, id, ...createRiskDto }: UpdateRiskDto,
    system: boolean,
    companyId: string,
  ): Promise<RiskFactorsEntity> {
    const risk = await this.prisma.riskFactors.update({
      data: {
        recMed: {
          upsert: !recMed
            ? []
            : recMed.map(({ id, ...rm }) => {
                return {
                  create: { system, companyId, ...rm },
                  update: { system, ...rm },
                  where: { id: id || 'no-id' },
                };
              }),
        },
        generateSource: {
          upsert: !generateSource
            ? []
            : generateSource.map(({ id, ...gs }) => {
                return {
                  create: { system, companyId, ...gs },
                  update: { system, ...gs },
                  where: { id: id || 'no-id' },
                };
              }),
        },
        ...createRiskDto,
      },
      where: { id_companyId: { companyId, id: id || 'no-id' } },
      include: { recMed: true, generateSource: true },
    });

    return new RiskFactorsEntity(risk);
  }

  async upsert(
    {
      companyId: _,
      id,
      recMed,
      generateSource,
      ...upsertRiskDto
    }: UpsertRiskDto,
    system: boolean,
    companyId: string,
  ): Promise<RiskFactorsEntity> {
    const risk = await this.prisma.riskFactors.upsert({
      create: {
        ...upsertRiskDto,
        system,
        companyId,
        recMed: {
          createMany: {
            data: !recMed
              ? []
              : recMed.map(({ id, ...rm }) => ({
                  system,
                  ...rm,
                })),
            skipDuplicates: true,
          },
        },
        generateSource: {
          createMany: {
            data: !generateSource
              ? []
              : generateSource.map(({ id, ...gs }) => ({
                  system,
                  ...gs,
                })),
            skipDuplicates: true,
          },
        },
      },
      update: {
        ...upsertRiskDto,
        system,
        recMed: {
          upsert: !recMed
            ? []
            : recMed.map(({ id, ...rm }) => {
                return {
                  create: { system, ...rm },
                  update: { system, ...rm },
                  where: { id: id || 'no-id' },
                };
              }),
        },
        generateSource: {
          upsert: !generateSource
            ? []
            : generateSource.map(({ id, companyId, recMeds: _, ...gs }) => {
                return {
                  create: { system, companyId, ...gs },
                  update: { system, ...gs },
                  where: { id: id || 'no-id' },
                };
              }),
        },
      },
      where: { id_companyId: { companyId, id: id || 'no-id' } },
      include: { recMed: true, generateSource: true },
    });

    return new RiskFactorsEntity(risk);
  }

  async upsertMany(
    upsertRiskDtoMany: UpsertRiskDto[],
    system: boolean,
    companyId: string,
  ): Promise<RiskFactorsEntity[]> {
    const data = await this.prisma.$transaction(
      upsertRiskDtoMany.map(
        ({ companyId: _, id, recMed, generateSource, ...upsertRiskDto }) =>
          this.prisma.riskFactors.upsert({
            create: {
              ...upsertRiskDto,
              system,
              companyId,
              recMed: {
                createMany: {
                  data: !recMed
                    ? []
                    : recMed.map(({ id, ...rm }) => ({
                        system,
                        ...rm,
                      })),
                  skipDuplicates: true,
                },
              },
              generateSource: {
                createMany: {
                  data: !generateSource
                    ? []
                    : generateSource.map(({ id, ...rm }) => ({
                        system,
                        ...rm,
                      })),
                  skipDuplicates: true,
                },
              },
            },
            update: {
              ...upsertRiskDto,
              system,
              recMed: {
                upsert: !recMed
                  ? []
                  : recMed.map(({ id, ...rm }) => {
                      return {
                        create: { system, ...rm },
                        update: { system, ...rm },
                        where: { id: id || 'no-id' },
                      };
                    }),
              },
              generateSource: {
                upsert: !generateSource
                  ? []
                  : generateSource.map(({ id, recMeds: _, ...gs }) => {
                      return {
                        create: { system, ...gs },
                        update: { system, ...gs },
                        where: { id: id || 'no-id' },
                      };
                    }),
              },
            },
            where: { id_companyId: { companyId, id: id || 'no-id' } },
            include: { recMed: true, generateSource: true },
          }),
      ),
    );

    return data.map((risk) => new RiskFactorsEntity(risk));
  }

  async find(
    query: Partial<FindRiskDto>,
    pagination: PaginationQueryDto,
    options: Prisma.RiskFactorsFindManyArgs = {},
  ) {
    const whereInit = {
      AND: [{ OR: [{ companyId: query.companyId }, { system: true }] }],
    } as typeof options.where;

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search', 'companyId'],
    });

    if ('search' in query) {
      const OR = [];
      OR.push({ name: { contains: query.search, mode: 'insensitive' } });

      (where.AND as any).push({ OR } as typeof options.where);
      delete query.search;
    }

    const response = await this.prisma.$transaction([
      this.prisma.riskFactors.count({
        where,
      }),
      this.prisma.riskFactors.findMany({
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: [{ type: 'asc' }, { name: 'asc' }],
        ...options,
      }),
    ]);

    return {
      data: response[1].map((data) => new RiskFactorsEntity(data)),
      count: response[0],
    };
  }

  async findById(
    id: string,
    companyId: string,
    options?: IPrismaOptions<{
      company?: boolean;
      recMed?: boolean;
      generateSource?: boolean;
    }>,
  ): Promise<RiskFactorsEntity> {
    const include = options.include || {};

    const risk = await this.prisma.riskFactors.findUnique({
      where: { id_companyId: { id, companyId } },
      include: {
        company: !!include.company,
        recMed: !!include.recMed,
        generateSource: !!include.generateSource,
      },
    });

    return new RiskFactorsEntity(risk);
  }

  async findAllByCompanyId(
    companyId: string,
    options?: IPrismaOptions<{
      company?: boolean;
      recMed?: boolean;
      generateSource?: boolean;
    }>,
  ): Promise<RiskFactorsEntity[]> {
    const where = options.where || {};
    const include = options.include || {};

    const risks = await this.prisma.riskFactors.findMany({
      where: { companyId, ...where },
      include: {
        company: !!include.company,
        recMed: !!include.recMed,
        generateSource: !!include.generateSource,
      },
    });

    return risks.map((risk) => new RiskFactorsEntity(risk));
  }

  async findNude(options: Prisma.RiskFactorsFindManyArgs = {}) {
    const risks = await this.prisma.riskFactors.findMany({
      ...options,
    });

    return risks.map((companyClinic) => new RiskFactorsEntity(companyClinic));
  }

  async findCountNude(
    pagination: PaginationQueryDto,
    options: Prisma.RiskFactorsFindManyArgs = {},
  ) {
    const response = await this.prisma.$transaction([
      this.prisma.riskFactors.count({
        where: options.where,
      }),
      this.prisma.riskFactors.findMany({
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        ...options,
      }),
    ]);

    return {
      data: response[1].map((employee) => new RiskFactorsEntity(employee)),
      count: response[0],
    };
  }

  async findAllAvailable(
    userCompanyId: string,
    {
      representAll,
      ...options
    }: {
      select?: Prisma.RiskFactorsSelect;
      include?: Prisma.RiskFactorsInclude;
      representAll?: boolean;
    } = {},
  ): Promise<RiskFactorsEntity[]> {
    const include = options.include || {};

    // const tenant: Prisma.RiskFactorsFindManyArgs['where']['AND'] = [
    const tenant = [
      {
        OR: [
          { companyId: userCompanyId },
          {
            company: {
              applyingServiceContracts: {
                some: { receivingServiceCompanyId: userCompanyId },
              },
            },
          },
          //! fix on front and back to only get from it's on company, but can see the risk (riskData) from other companies
          {
            company: {
              receivingServiceContracts: {
                some: { applyingServiceCompanyId: userCompanyId },
              },
            },
          },
          { system: true },
        ],
      },
    ];

    const risks = await this.prisma.riskFactors.findMany({
      where: {
        AND: [...tenant],
        deleted_at: null,
      },
      include: {
        recMed: { where: { deleted_at: null, AND: [...tenant] } },
        generateSource: { where: { deleted_at: null, AND: [...tenant] } },
        ...include,
      },
    });

    return risks.map((risk) => new RiskFactorsEntity(risk));
  }

  async DeleteByIdSoft(id: string): Promise<RiskFactorsEntity> {
    const riskFactors = await this.prisma.riskFactors.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    return new RiskFactorsEntity(riskFactors);
  }

  async DeleteByCompanyAndIdSoft(
    id: string,
    companyId: string,
  ): Promise<RiskFactorsEntity> {
    const riskFactors = await this.prisma.riskFactors.update({
      where: { id_companyId: { id, companyId } },
      data: { deleted_at: new Date() },
    });

    return new RiskFactorsEntity(riskFactors);
  }
}
