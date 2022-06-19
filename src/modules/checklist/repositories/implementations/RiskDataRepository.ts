/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { removeDuplicate } from '../../../../shared/utils/removeDuplicate';

import { PrismaService } from '../../../../prisma/prisma.service';
import {
  UpsertManyRiskDataDto,
  UpsertRiskDataDto,
} from '../../dto/risk-data.dto';
import { RiskFactorDataEntity } from '../../entities/riskData.entity';
import { PrismaPromise } from '@prisma/client';

@Injectable()
export class RiskDataRepository {
  constructor(private prisma: PrismaService) {}
  async upsert(
    upsertRiskDataDto: Omit<UpsertRiskDataDto, 'keepEmpty'>,
  ): Promise<RiskFactorDataEntity> {
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
      const riskData = { ...data } as RiskFactorDataEntity;
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
}
