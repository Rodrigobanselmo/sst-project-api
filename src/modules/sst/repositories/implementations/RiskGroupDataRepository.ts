import { isEnvironment } from '../../../company/repositories/implementations/CharacterizationRepository';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertRiskGroupDataDto } from '../../dto/risk-group-data.dto';
import { RiskFactorGroupDataEntity } from '../../entities/riskGroupData.entity';
import { RiskFactorDataEntity } from '../../entities/riskData.entity';
import { m2mGetDeletedIds } from './../../../../shared/utils/m2mFilterIds';

@Injectable()
export class RiskGroupDataRepository {
  constructor(private prisma: PrismaService) {}
  async upsert({ companyId, id, ...createDto }: UpsertRiskGroupDataDto): Promise<RiskFactorGroupDataEntity> {
    const riskFactorGroupDataEntity = await this.prisma.riskFactorGroupData.upsert({
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
    const riskFactorGroupDataEntity = await this.prisma.riskFactorGroupData.findMany({
      where: { companyId },
    });

    return riskFactorGroupDataEntity.map((data) => new RiskFactorGroupDataEntity(data));
  }

  async findById(
    id: string,
    companyId: string,
    options: {
      select?: Prisma.RiskFactorGroupDataSelect;
      include?: Prisma.RiskFactorGroupDataInclude;
    } = {},
  ) {
    const riskFactorGroupDataEntity = await this.prisma.riskFactorGroupData.findUnique({
      where: { id_companyId: { id, companyId } },
      ...options,
    });

    return new RiskFactorGroupDataEntity(riskFactorGroupDataEntity);
  }

  async findAllDataById(
    id: string,
    workspaceId: string,
    companyId: string,
    options: {
      select?: Prisma.RiskFactorGroupDataSelect;
      include?: Prisma.RiskFactorGroupDataInclude;
    } = {},
  ) {
    const riskFactorGroupDataEntity = await this.prisma.riskFactorGroupData.findUnique({
      where: { id_companyId: { id, companyId } },
      include: {
        company: true,
        data: {
          where: {
            homogeneousGroup: {
              hierarchyOnHomogeneous: {
                some: {
                  OR: [
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
          include: {
            adms: true,
            recs: true,
            generateSources: true,
            epiToRiskFactorData: { include: { epi: true } },
            engsToRiskFactorData: { include: { recMed: true } },
            riskFactor: {
              include: {
                docInfo: {
                  where: {
                    OR: [
                      { companyId },
                      {
                        company: {
                          applyingServiceContracts: {
                            some: { receivingServiceCompanyId: companyId },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            dataRecs: true,
            hierarchy: {
              //! edit employee
              include: { employees: { select: { _count: true } } },
            },
            homogeneousGroup: {
              include: { characterization: true },
            },
          },
        },
      },
    });

    riskFactorGroupDataEntity.data.map((data, index) => {
      if (data.homogeneousGroup.characterization && isEnvironment(data.homogeneousGroup.characterization.type)) {
        (riskFactorGroupDataEntity.data[index].homogeneousGroup as any).environment = data.homogeneousGroup.characterization as any;
        riskFactorGroupDataEntity.data[index].homogeneousGroup.characterization = data.homogeneousGroup.characterization = null;
      }
    });

    // const riskFactorGroupData = {
    //   ...riskFactorGroupDataEntity,
    // } as any;

    // riskFactorGroupData.data = riskFactorGroupDataEntity.data.map(
    //   (riskData) => {
    //     const data = { ...riskData } as any;
    //     if (
    //       data.homogeneousGroup &&
    //       data.homogeneousGroup.hierarchyOnHomogeneous
    //     )
    //       data.homogeneousGroup.hierarchies =
    //         riskData.homogeneousGroup.hierarchyOnHomogeneous.map(
    //           (hierarchy) => ({
    //             ...hierarchy.hierarchy,
    //             hierarchyId: hierarchy.hierarchyId,
    //           }),
    //         );
    //     return;
    //   },
    // );

    return new RiskFactorGroupDataEntity(riskFactorGroupDataEntity);
  }

  async findDocumentData(id: string, companyId: string, options?: { workspaceId?: string }) {
    const riskFactorGroupData = await this.prisma.riskFactorGroupData.findUnique({
      where: { id_companyId: { id, companyId } },
      include: {
        data: {
          where: {
            homogeneousGroup: {
              status: 'ACTIVE',
              ...(options.workspaceId && {
                workspaces: { some: { id: options.workspaceId } },
              }),
            },
          },
          include: {
            adms: true,
            recs: true,
            generateSources: true,
            epiToRiskFactorData: { include: { epi: true } },
            engsToRiskFactorData: { include: { recMed: true } },
            riskFactor: {
              include: {
                docInfo: {
                  where: {
                    OR: [
                      { companyId },
                      {
                        company: {
                          applyingServiceContracts: {
                            some: { receivingServiceCompanyId: companyId },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            dataRecs: true,
          },
        },
      },
    });

    return new RiskFactorGroupDataEntity(riskFactorGroupData);
  }
}
