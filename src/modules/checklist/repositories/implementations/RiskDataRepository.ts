/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertRiskDataDto } from '../../dto/risk-data.dto';
import { RiskFactorDataEntity } from '../../entities/riskData.entity';

@Injectable()
export class RiskDataRepository {
  constructor(private prisma: PrismaService) {}
  async upsert({
    recMeds,
    epis,
    generateSources,
    companyId,
    id,
    ...createDto
  }: UpsertRiskDataDto): Promise<RiskFactorDataEntity> {
    const riskFactorData = await this.prisma.riskFactorData.upsert({
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
                id_companyId: { companyId, id },
              })),
            }
          : undefined,
        recMeds: recMeds
          ? {
              connect: recMeds.map((id) => ({
                id_companyId: { companyId, id },
              })),
            }
          : undefined,
      },
      update: {
        ...createDto,
        companyId,
        recMeds: recMeds
          ? {
              set: recMeds.map((id) => ({ id_companyId: { companyId, id } })),
            }
          : undefined,
        generateSources: generateSources
          ? {
              set: generateSources.map((id) => ({
                id_companyId: { companyId, id },
              })),
            }
          : undefined,
        epis: epis
          ? {
              set: epis.map((id) => ({ id })),
            }
          : undefined,
      },
      where: { id_companyId: { companyId, id: id || 'not-found' } },
      include: {
        recMeds: true,
        generateSources: true,
        epis: true,
      },
    });

    return new RiskFactorDataEntity(riskFactorData);
  }

  async findAllByGroup(riskFactorGroupDataId: string, companyId?: string) {
    const riskFactorData = await this.prisma.riskFactorData.findMany({
      where: { riskFactorGroupDataId, companyId },
      include: {
        recMeds: true,
        generateSources: true,
        epis: true,
        hierarchy: true,
        riskFactor: true,
        homogeneousGroup: { include: { hierarchies: true } },
      },
    });
    return riskFactorData.map((data) => new RiskFactorDataEntity(data));
  }

  async findAllByGroupAndRisk(
    riskFactorGroupDataId: string,
    riskId: string,
    companyId: string,
  ) {
    const riskFactorData = await this.prisma.riskFactorData.findMany({
      where: { riskFactorGroupDataId, companyId, riskId },
      include: {
        recMeds: true,
        generateSources: true,
        epis: true,
      },
    });

    return riskFactorData.map((data) => new RiskFactorDataEntity(data));
  }
}
