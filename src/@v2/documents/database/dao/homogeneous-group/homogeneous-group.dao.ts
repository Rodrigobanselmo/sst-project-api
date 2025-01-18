import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IHomogeneousGroupDAO } from './homogeneous-group.types';
import { HomogeneousGroupMapper } from '../../mappers/homogeneous-group.mapper';
import { RiskDataDAO } from '../risk-data/risk-data.dao';

@Injectable()
export class HomogeneousGroupDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions({ companyId }: { companyId: string }) {
    const include = {
      riskFactorData: RiskDataDAO.selectOptions({ companyId }),
      hierarchyOnHomogeneous: true,
      characterization: {
        include: {
          photos: true,
        },
      },
    } satisfies Prisma.HomogeneousGroupFindFirstArgs['include'];

    return { include };
  }

  async findMany(params: IHomogeneousGroupDAO.FindByIdParams) {
    const homogeneousGroups = await this.prisma.homogeneousGroup.findMany({
      where: {
        workspaces: { some: { id: params.workspaceId } },
        ...(params?.homogeneousGroupsIds.length
          ? {
              OR: [
                {
                  id: { in: params.homogeneousGroupsIds },
                },
                {
                  hierarchyOnHomogeneous: {
                    some: {
                      hierarchy: {
                        OR: [
                          {
                            id: { in: params.homogeneousGroupsIds },
                          },
                          {
                            parent: { id: { in: params.homogeneousGroupsIds } },
                          },
                          {
                            parent: { parent: { id: { in: params.homogeneousGroupsIds } } },
                          },
                          {
                            parent: { parent: { parent: { id: { in: params.homogeneousGroupsIds } } } },
                          },
                          {
                            parent: { parent: { parent: { parent: { id: { in: params.homogeneousGroupsIds } } } } },
                          },
                          {
                            parent: {
                              parent: { parent: { parent: { parent: { id: { in: params.homogeneousGroupsIds } } } } },
                            },
                          },
                          {
                            children: { some: { id: { in: params.homogeneousGroupsIds } } },
                          },
                          {
                            children: { some: { children: { some: { id: { in: params.homogeneousGroupsIds } } } } },
                          },
                          {
                            children: {
                              some: {
                                children: { some: { children: { some: { id: { in: params.homogeneousGroupsIds } } } } },
                              },
                            },
                          },
                          {
                            children: {
                              some: {
                                children: {
                                  some: {
                                    children: {
                                      some: { children: { some: { id: { in: params.homogeneousGroupsIds } } } },
                                    },
                                  },
                                },
                              },
                            },
                          },
                          {
                            children: {
                              some: {
                                children: {
                                  some: {
                                    children: {
                                      some: {
                                        children: {
                                          some: { children: { some: { id: { in: params.homogeneousGroupsIds } } } },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              ],
            }
          : {}),
      },
      ...HomogeneousGroupDAO.selectOptions(params),
    });

    return HomogeneousGroupMapper.toModels(homogeneousGroups);
  }
}
