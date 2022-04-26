/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { IPrismaOptions } from '../../../../shared/interfaces/prisma-options.types';
import {
  CreateRiskDto,
  UpdateRiskDto,
  UpsertRiskDto,
} from '../../dto/risk.dto';
import { RiskFactorsEntity } from '../../entities/risk.entity';
import { IRiskRepository } from '../IRiskRepository.types';

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
            data: recMed ? recMed.map(({ ...rm }) => ({ system, ...rm })) : [],
            skipDuplicates: true,
          },
        },
        generateSource: {
          createMany: {
            data: generateSource
              ? generateSource.map(({ ...gs }) => ({ system, ...gs }))
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
                  create: { system, ...rm },
                  update: { system, ...rm },
                  where: { id_companyId: { companyId, id: id || 'no-id' } },
                };
              }),
        },
        generateSource: {
          upsert: !generateSource
            ? []
            : generateSource.map(({ id, ...gs }) => {
                return {
                  create: { system, ...gs },
                  update: { system, ...gs },
                  where: { id_companyId: { companyId, id: id || 'no-id' } },
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
            : recMed.map(({ companyId: _, id, ...rm }) => {
                return {
                  create: { system, ...rm },
                  update: { system, ...rm },
                  where: { id_companyId: { companyId, id: id || 'no-id' } },
                };
              }),
        },
        generateSource: {
          upsert: !generateSource
            ? []
            : generateSource.map(({ companyId: _, id, ...gs }) => {
                return {
                  create: { system, ...gs },
                  update: { system, ...gs },
                  where: { id_companyId: { companyId, id: id || 'no-id' } },
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
                  : recMed.map(({ companyId: _, id, ...rm }) => {
                      return {
                        create: { system, ...rm },
                        update: { system, ...rm },
                        where: {
                          id_companyId: { companyId, id: id || 'no-id' },
                        },
                      };
                    }),
              },
              generateSource: {
                upsert: !generateSource
                  ? []
                  : generateSource.map(({ companyId: _, id, ...gs }) => {
                      return {
                        create: { system, ...gs },
                        update: { system, ...gs },
                        where: {
                          id_companyId: { companyId, id: id || 'no-id' },
                        },
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

  async findAllAvailable(
    companyId: string,
    options?: IPrismaOptions<{
      company?: boolean;
      recMed?: boolean;
      generateSource?: boolean;
    }> & { representAll?: boolean },
  ): Promise<RiskFactorsEntity[]> {
    const include = options.include || {};
    const representAll =
      typeof options.representAll === 'boolean'
        ? { representAll: options.representAll }
        : {};

    const risks = await this.prisma.riskFactors.findMany({
      where: {
        AND: [{ OR: [{ companyId }, { system: true }] }, representAll],
      },
      include: {
        company: !!include.company,
        recMed: !!include.recMed,
        generateSource: !!include.generateSource,
      },
    });

    return risks.map((risk) => new RiskFactorsEntity(risk));
  }
}
