/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertRiskGroupDataDto } from '../../dto/risk-group-data.dto';
import { RiskFactorDataEntity } from '../../entities/riskData.entity';
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

  async findAllByCompany(companyId: string, workspaceId: string) {
    const riskFactorGroupDataEntity =
      await this.prisma.riskFactorGroupData.findMany({
        where: { companyId, workspaceId },
      });

    return riskFactorGroupDataEntity.map(
      (data) => new RiskFactorGroupDataEntity(data),
    );
  }

  async findById(
    id: string,
    companyId: string,
    options: {
      select?: Prisma.RiskFactorGroupDataSelect;
      include?: Prisma.RiskFactorGroupDataInclude;
    } = {},
  ) {
    const riskFactorGroupDataEntity =
      await this.prisma.riskFactorGroupData.findUnique({
        where: { id_companyId: { id, companyId } },
        ...options,
      });

    return new RiskFactorGroupDataEntity(riskFactorGroupDataEntity);
  }

  async findAllDataById(
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
                ? { include: { employees: true } }
                : true,
              homogeneousGroup: {
                include: {
                  hierarchyOnHomogeneous: {
                    include: {
                      hierarchy: options?.includeEmployees
                        ? { include: { employees: true } }
                        : true,
                    },
                  },
                },
              },
            },
          },
          company: true,
        },
      });

    const riskFactorGroupData = {
      ...riskFactorGroupDataEntity,
    } as any;

    riskFactorGroupData.data = riskFactorGroupDataEntity.data.map(
      (riskData) => {
        const data = { ...riskData } as any;
        if (
          data.homogeneousGroup &&
          data.homogeneousGroup.hierarchyOnHomogeneous
        )
          data.homogeneousGroup.hierarchies =
            riskData.homogeneousGroup.hierarchyOnHomogeneous.map(
              (hierarchy) => ({
                ...hierarchy.hierarchy,
                hierarchyId: hierarchy.hierarchyId,
              }),
            );
        return;
      },
    );

    return new RiskFactorGroupDataEntity(riskFactorGroupDataEntity);
  }
}
