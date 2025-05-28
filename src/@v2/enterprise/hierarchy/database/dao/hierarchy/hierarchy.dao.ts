import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { IHierarchyDAO } from './hierarchy.types';
import { HierarchiesTypesModelMapper } from '../../mappers/models/hierarchy/hierarchy-types.mapper';
import { HierarchyBrowseQuery } from './queries/browse-hierarchy.dao';
import { HierarchyBrowseShortQuery } from './queries/browse-short-hierarchy.dao';

@Injectable()
export class HierarchyDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async findTypes({ companyId, workspaceId }: IHierarchyDAO.FindTypesParams) {
    const result = await this.prisma.hierarchy.findMany({
      where: {
        companyId,
        workspaces: workspaceId
          ? {
              some: {
                id: workspaceId,
              },
            }
          : undefined,
      },
      select: {
        type: true,
      },
      distinct: ['type'],
    });

    return HierarchiesTypesModelMapper.toModel(result);
  }

  async browse(params: IHierarchyDAO.BrowseParams) {
    return new HierarchyBrowseQuery(this.prisma).browse(params);
  }

  async browseShort(params: IHierarchyDAO.BrowseParams) {
    return new HierarchyBrowseShortQuery(this.prisma).browseShort(params);
  }
}
