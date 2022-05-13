/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertRiskGroupDataDto } from '../../dto/risk-group-data.dto';
import { RiskFactorGroupDataEntity } from '../../entities/riskGroupData.entity';

@Injectable()
export class RiskGroupDataRepository {
  constructor(private prisma: PrismaService) {}
  async upsert({
    companyId,
    id,
    ...createDto
  }: UpsertRiskGroupDataDto): Promise<RiskFactorGroupDataEntity> {
    const riskFactorGroupDataEntity =
      await this.prisma.riskFactorGroupData.upsert({
        create: {
          ...createDto,
          companyId,
        },
        update: {
          ...createDto,
          companyId,
        },
        where: { id_companyId: { companyId, id: id || 'not-found' } },
      });

    return new RiskFactorGroupDataEntity(riskFactorGroupDataEntity);
  }

  async findAllByCompany(companyId: string) {
    const riskFactorGroupDataEntity =
      await this.prisma.riskFactorGroupData.findMany({
        where: { companyId },
      });

    return riskFactorGroupDataEntity.map(
      (data) => new RiskFactorGroupDataEntity(data),
    );
  }

  async findById(
    id: string,
    companyId: string,
    options?: { includeEmployees: boolean },
  ) {
    const riskFactorGroupDataEntity =
      await this.prisma.riskFactorGroupData.findUnique({
        where: { id_companyId: { id, companyId } },
        include: {
          data: {
            include: {
              adms: true,
              recs: true,
              engs: true,
              generateSources: true,
              epis: true,
              riskFactor: true,
              hierarchy: options?.includeEmployees
                ? { include: { employee: true } }
                : true,
              homogeneousGroup: {
                include: {
                  hierarchies: options?.includeEmployees
                    ? { include: { employee: true } }
                    : true,
                },
              },
            },
          },
          company: true,
        },
      });

    return new RiskFactorGroupDataEntity(riskFactorGroupDataEntity);
  }
}
