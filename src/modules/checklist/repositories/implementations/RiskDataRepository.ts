import { isEnvironment } from './../../../company/repositories/implementations/CharacterizationRepository';
import { PaginationQueryDto } from './../../../../shared/dto/pagination.dto';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { removeDuplicate } from '../../../../shared/utils/removeDuplicate';

import { PrismaService } from '../../../../prisma/prisma.service';
import {
  FindRiskDataDto,
  UpsertManyRiskDataDto,
  UpsertRiskDataDto,
} from '../../dto/risk-data.dto';
import { RiskFactorDataEntity } from '../../entities/riskData.entity';
import { Prisma, PrismaPromise } from '@prisma/client';
import { getMatrizRisk } from '../../../../shared/utils/matriz';

@Injectable()
export class RiskDataRepository {
  constructor(private prisma: PrismaService) {}
  async upsert(
    upsertRiskDataDto: Omit<UpsertRiskDataDto, 'keepEmpty' | 'type'>,
  ): Promise<RiskFactorDataEntity> {
    const level = await this.addLevel(upsertRiskDataDto);
    if (level) upsertRiskDataDto.level = level;

    const riskFactorData = await this.upsertPrisma(upsertRiskDataDto);

    return new RiskFactorDataEntity(riskFactorData);
  }

  async upsertConnectMany(
    upsertManyRiskDataDto: UpsertManyRiskDataDto,
  ): Promise<RiskFactorDataEntity[]> {
    const homogeneousGroupIds = upsertManyRiskDataDto.homogeneousGroupIds;
    if (homogeneousGroupIds) {
      delete upsertManyRiskDataDto.homogeneousGroupIds;
      delete upsertManyRiskDataDto.hierarchyIds;
      delete upsertManyRiskDataDto.riskIds;

      const level = await this.addLevel(upsertManyRiskDataDto);
      if (level) upsertManyRiskDataDto.level = level;

      const data = await this.prisma.$transaction(
        homogeneousGroupIds.map((homogeneousGroupId) =>
          this.upsertConnectPrisma({
            homogeneousGroupId,
            ...upsertManyRiskDataDto,
          } as unknown as UpsertRiskDataDto),
        ),
      );

      return data.map(
        (riskFactorData) => new RiskFactorDataEntity(riskFactorData),
      );
    }
    return [];
  }

  async upsertMany(
    upsertManyRiskDataDto: UpsertManyRiskDataDto,
  ): Promise<RiskFactorDataEntity[]> {
    const homogeneousGroupIds = upsertManyRiskDataDto.homogeneousGroupIds;
    if (homogeneousGroupIds) {
      delete upsertManyRiskDataDto.homogeneousGroupIds;
      delete upsertManyRiskDataDto.hierarchyIds;
      delete upsertManyRiskDataDto.riskIds;

      const level = await this.addLevel(upsertManyRiskDataDto);
      if (level) upsertManyRiskDataDto.level = level;

      const data = await this.prisma.$transaction(
        homogeneousGroupIds.map((homogeneousGroupId) =>
          this.upsertPrisma({
            homogeneousGroupId,
            ...upsertManyRiskDataDto,
          } as unknown as UpsertRiskDataDto),
        ),
      );

      return data.map(
        (riskFactorData) => new RiskFactorDataEntity(riskFactorData),
      );
    }
    return [];
  }

  async findAllByGroup(riskFactorGroupDataId: string, companyId?: string) {
    const riskFactorData = await this.prisma.riskFactorData.findMany({
      where: { riskFactorGroupDataId, companyId },
      include: {
        adms: true,
        recs: true,
        engs: true,
        generateSources: true,
        epis: true,
        hierarchy: true,
        riskFactor: true,
        homogeneousGroup: {
          include: {
            hierarchyOnHomogeneous: { include: { hierarchy: true } }, //!
          },
        },
      },
    });
    return riskFactorData.map((data) => {
      const riskData = { ...data } as unknown as RiskFactorDataEntity;
      if (data.homogeneousGroup && data.homogeneousGroup.hierarchyOnHomogeneous)
        riskData.homogeneousGroup.hierarchies =
          data.homogeneousGroup.hierarchyOnHomogeneous.map((homo) => ({
            ...homo.hierarchy,
            workspaceId: homo.workspaceId,
          }));

      return new RiskFactorDataEntity(riskData);
    });
  }

  async findAllByGroupAndRisk(
    riskFactorGroupDataId: string,
    riskId: string,
    companyId: string,
  ) {
    const riskFactorData = await this.prisma.riskFactorData.findMany({
      where: { riskFactorGroupDataId, companyId, riskId },
      include: {
        adms: true,
        recs: true,
        engs: true,
        generateSources: true,
        epis: true,
      },
    });

    return riskFactorData.map((data) => new RiskFactorDataEntity(data));
  }

  async findAllActionPlan(
    riskFactorGroupDataId: string,
    workspaceId: string,
    companyId: string,
    query: Partial<FindRiskDataDto>,
    pagination: PaginationQueryDto,
  ) {
    const where = {
      AND: [
        {
          riskFactorGroupDataId,
          companyId,
          recs: { some: { recName: { contains: '' } } },
          homogeneousGroup: {
            hierarchyOnHomogeneous: {
              some: {
                OR: [
                  { workspaceId: workspaceId },
                  {
                    hierarchy: {
                      workspaces: {
                        some: { id: workspaceId },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    } as Prisma.RiskFactorDataFindManyArgs['where'];

    // if ('search' in query) {
    //   (where.AND as any).push({
    //     OR: [{ name: { contains: query.search, mode: 'insensitive' } }],
    //   } as Prisma.RiskFactorDataFindManyArgs['where']);
    //   delete query.search;
    // }

    // Object.entries(query).forEach(([key, value]) => {
    //   if (value)
    //     (where.AND as any).push({
    //       [key]: {
    //         contains: value,
    //         mode: 'insensitive',
    //       },
    //     } as Prisma.RiskFactorDataFindManyArgs['where']);
    // });

    const response = await this.prisma.$transaction([
      this.prisma.riskFactorData.count({
        where,
      }),
      this.prisma.riskFactorData.findMany({
        where,
        orderBy: { level: 'desc' },
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        include: {
          adms: true,
          recs: true,
          engs: true,
          generateSources: true,
          riskFactor: true,
          epis: true,
          dataRecs: { include: { comments: true } },
          homogeneousGroup: {
            include: { characterization: true, environment: true },
          },
        },
      }),
    ]);

    const riskData = await Promise.all(
      (response[1] as unknown as RiskFactorDataEntity[]).map(async (data) => {
        if (
          data.homogeneousGroup &&
          data.homogeneousGroup.type === 'HIERARCHY'
        ) {
          const hierarchy = await this.prisma.hierarchy.findUnique({
            where: { id: data.homogeneousGroup.id },
          });

          data.homogeneousGroup.hierarchy = hierarchy;
        }

        if (
          data.homogeneousGroup.characterization &&
          isEnvironment(data.homogeneousGroup.characterization.type)
        ) {
          data.homogeneousGroup.environment =
            data.homogeneousGroup.characterization;

          data.homogeneousGroup.characterization = null;
        }

        return new RiskFactorDataEntity(data);
      }),
    );

    return {
      data: riskData,
      count: response[0],
    };
  }

  async findAllByHomogeneousGroupId(
    companyId: string,
    riskFactorGroupDataId: string,
    homogeneousGroupId: string,
  ) {
    const riskFactorData = await this.prisma.riskFactorData.findMany({
      where: { riskFactorGroupDataId, companyId, homogeneousGroupId },
      include: {
        adms: true,
        recs: true,
        engs: true,
        generateSources: true,
        epis: true,
      },
    });

    return riskFactorData.map((data) => new RiskFactorDataEntity(data));
  }

  async deleteById(id: string) {
    const riskFactorData = await this.prisma.riskFactorData.delete({
      where: { id },
    });

    return new RiskFactorDataEntity(riskFactorData);
  }

  async deleteByIds(ids: string[]) {
    const riskFactorData = await this.prisma.riskFactorData.deleteMany({
      where: { id: { in: ids } },
    });

    return riskFactorData;
  }

  async deleteByHomoAndRisk(
    homogeneousGroupIds: string[],
    riskIds: string[],
    groupId: string,
  ) {
    const riskFactorData = await this.prisma.riskFactorData.deleteMany({
      where: {
        AND: [
          { homogeneousGroupId: { in: homogeneousGroupIds } },
          { riskId: { in: riskIds } },
          { riskFactorGroupDataId: groupId },
        ],
      },
    });

    return riskFactorData;
  }

  private upsertPrisma({
    recs,
    adms,
    engs,
    epis,
    generateSources,
    companyId,
    id,
    ...createDto
  }: Omit<UpsertRiskDataDto, 'keepEmpty'>) {
    return this.prisma.riskFactorData.upsert({
      create: {
        ...createDto,
        companyId,
        epis: epis
          ? {
              connect: epis.map((id) => ({ id })),
            }
          : undefined,
        generateSources: generateSources
          ? {
              connect: generateSources.map((id) => ({
                id,
              })),
            }
          : undefined,
        recs: recs
          ? {
              connect: recs.map((id) => ({
                id,
              })),
            }
          : undefined,
        adms: adms
          ? {
              connect: adms.map((id) => ({
                id,
              })),
            }
          : undefined,
        engs: engs
          ? {
              connect: engs.map((id) => ({
                id,
              })),
            }
          : undefined,
      },
      update: {
        ...createDto,
        companyId,
        recs: recs
          ? {
              set: recs.map((id) => ({
                id,
              })),
            }
          : undefined,
        adms: adms
          ? {
              set: adms.map((id) => ({
                id,
              })),
            }
          : undefined,
        engs: engs
          ? {
              set: engs.map((id) => ({
                id,
              })),
            }
          : undefined,
        generateSources: generateSources
          ? {
              set: generateSources.map((id) => ({
                id,
              })),
            }
          : undefined,
        epis: epis
          ? {
              set: epis.map((id) => ({ id })),
            }
          : undefined,
      },
      where: {
        homogeneousGroupId_riskId_riskFactorGroupDataId: {
          riskFactorGroupDataId: createDto.riskFactorGroupDataId,
          riskId: createDto.riskId,
          homogeneousGroupId: createDto.homogeneousGroupId,
        },
      },
      include: {
        adms: true,
        recs: true,
        engs: true,
        generateSources: true,
        epis: true,
      },
    });
  }

  private upsertConnectPrisma({
    recs,
    adms,
    engs,
    epis,
    generateSources,
    companyId,
    id,
    ...createDto
  }: Omit<UpsertRiskDataDto, 'keepEmpty'>) {
    return this.prisma.riskFactorData.upsert({
      create: {
        ...createDto,
        companyId,
        epis: epis
          ? {
              connect: epis.map((id) => ({ id })),
            }
          : undefined,
        generateSources: generateSources
          ? {
              connect: generateSources.map((id) => ({
                id,
              })),
            }
          : undefined,
        recs: recs
          ? {
              connect: recs.map((id) => ({
                id,
              })),
            }
          : undefined,
        adms: adms
          ? {
              connect: adms.map((id) => ({
                id,
              })),
            }
          : undefined,
        engs: engs
          ? {
              connect: engs.map((id) => ({
                id,
              })),
            }
          : undefined,
      },
      update: {
        ...createDto,
        companyId,
        recs: recs
          ? {
              connect: recs.map((id) => ({
                id,
              })),
            }
          : undefined,
        adms: adms
          ? {
              connect: adms.map((id) => ({
                id,
              })),
            }
          : undefined,
        engs: engs
          ? {
              connect: engs.map((id) => ({
                id,
              })),
            }
          : undefined,
        generateSources: generateSources
          ? {
              connect: generateSources.map((id) => ({
                id,
              })),
            }
          : undefined,
        epis: epis
          ? {
              connect: epis.map((id) => ({ id })),
            }
          : undefined,
      },
      where: {
        homogeneousGroupId_riskId_riskFactorGroupDataId: {
          riskFactorGroupDataId: createDto.riskFactorGroupDataId,
          riskId: createDto.riskId,
          homogeneousGroupId: createDto.homogeneousGroupId,
        },
      },
      include: {
        adms: true,
        recs: true,
        engs: true,
        generateSources: true,
        epis: true,
      },
    });
  }

  private async addLevel({
    riskId,
    probability,
  }: {
    riskId?: string;
    probability?: number;
  }) {
    let level = 0;
    if (probability && riskId) {
      const risk = await this.prisma.riskFactors.findUnique({
        where: {
          id: riskId,
        },
      });

      if (risk && risk.severity) {
        const matriz = getMatrizRisk(risk.severity, probability);

        level = matriz.level;
        risk.severity;
      }
    }

    return level;
  }
}
