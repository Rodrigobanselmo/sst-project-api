import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IHomogeneousGroupDAO } from './homogeneous-group.types';
import { HomogeneousGroupMapper } from '../../mappers/homogeneous-group.mapper';
import { RiskDataDAO } from '../risk-data/risk-data.dao';
import { buildHomogeneousGroupExpandedFilterWhere } from './homogeneous-group-expanded-filter.where';
import { resolveHomogeneousGroupFilterMode } from './resolve-homogeneous-group-filter-mode.util';

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
    const homogeneousGroupsFilter = await this.buildHomogeneousGroupsFilter(params);

    const homogeneousGroups = await this.prisma.homogeneousGroup.findMany({
      where: {
        workspaces: { some: { id: params.workspaceId } },
        status: 'ACTIVE',
        ...homogeneousGroupsFilter,
      },
      ...HomogeneousGroupDAO.selectOptions(params),
    });

    return HomogeneousGroupMapper.toModels(homogeneousGroups);
  }

  private async buildHomogeneousGroupsFilter(
    params: IHomogeneousGroupDAO.FindByIdParams,
  ): Promise<Prisma.HomogeneousGroupWhereInput> {
    if (!params.homogeneousGroupsIds?.length) {
      return {};
    }

    const filterMode = await resolveHomogeneousGroupFilterMode(this.prisma, {
      workspaceId: params.workspaceId,
      homogeneousGroupsIds: params.homogeneousGroupsIds,
    });

    if (filterMode === 'strict') {
      return {
        id: { in: params.homogeneousGroupsIds },
      };
    }

    return buildHomogeneousGroupExpandedFilterWhere(params.homogeneousGroupsIds);
  }
}
