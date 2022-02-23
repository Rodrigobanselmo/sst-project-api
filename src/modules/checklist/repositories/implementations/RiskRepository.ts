/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { RiskFactorsEnum } from '@prisma/client';
import { IPrismaOptions } from 'src/shared/interfaces/prisma-options.types';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateRiskDto, UpsertRiskDto } from '../../dto/create-risk.dto';
import { RiskFactorsEntity } from '../../entities/risk.entity';
import { IRiskRepository } from '../IRiskRepository.types';

@Injectable()
export class RiskRepository implements IRiskRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    { recMed, ...createRiskDto }: CreateRiskDto,
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
      },
    });

    return new RiskFactorsEntity(risk);
  }

  async upsert(
    { companyId: _, id, recMed, ...upsertRiskDto }: UpsertRiskDto,
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
                  where: { id_companyId: { companyId, id: id || -1 } },
                };
              }),
        },
      },
      where: { id_companyId: { companyId, id: id || -1 } },
      include: { recMed: true },
    });

    return new RiskFactorsEntity(risk);
  }

  async upsertMany(
    upsertRiskDtoMany: UpsertRiskDto[],
    system: boolean,
    companyId: string,
  ): Promise<RiskFactorsEntity[]> {
    const data = await this.prisma.$transaction(
      upsertRiskDtoMany.map(({ companyId: _, id, recMed, ...upsertRiskDto }) =>
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
                      where: { id_companyId: { companyId, id: id || -1 } },
                    };
                  }),
            },
          },
          where: { id_companyId: { companyId, id: id || -1 } },
          include: { recMed: true },
        }),
      ),
    );

    return data.map((risk) => new RiskFactorsEntity(risk));
  }

  async findById(
    id: number,
    companyId: string,
    options?: IPrismaOptions<{ company?: boolean; recMed?: boolean }>,
  ): Promise<RiskFactorsEntity> {
    const include = options.include || {};

    const risk = await this.prisma.riskFactors.findUnique({
      where: { id_companyId: { id, companyId } },
      include: { company: !!include.company, recMed: !!include.recMed },
    });

    return new RiskFactorsEntity(risk);
  }

  async findAllByCompanyId(
    companyId: string,
    options?: IPrismaOptions<{ company?: boolean; recMed?: boolean }>,
  ): Promise<RiskFactorsEntity[]> {
    const where = options.where || {};
    const include = options.include || {};

    const risks = await this.prisma.riskFactors.findMany({
      where: { companyId, ...where },
      include: { company: !!include.company, recMed: !!include.recMed },
    });

    return risks.map((risk) => new RiskFactorsEntity(risk));
  }

  async findAllAvailable(
    companyId: string,
    options?: IPrismaOptions<{ company?: boolean; recMed?: boolean }>,
  ): Promise<RiskFactorsEntity[]> {
    const include = options.include || {};

    const risks = await this.prisma.riskFactors.findMany({
      where: { OR: [{ companyId }, { system: true }] },
      include: { company: !!include.company, recMed: !!include.recMed },
    });

    return risks.map((risk) => new RiskFactorsEntity(risk));
  }
}
