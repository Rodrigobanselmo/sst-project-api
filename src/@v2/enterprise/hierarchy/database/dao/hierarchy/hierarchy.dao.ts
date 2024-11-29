import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { IHierarchyDAO } from './hierarchy.types';
import { HierarchiesTypesModelMapper } from '../../mappers/models/hierarchy/hierarchy-types.mapper';


@Injectable()
export class HierarchyDAO {
  constructor(
    private readonly prisma: PrismaServiceV2,
  ) { }

  async findTypes({ companyId, workspaceId }: IHierarchyDAO.FindTypesParams) {
    const result = await this.prisma.hierarchy.findMany({
      where: {
        companyId,
        workspaces: workspaceId ? {
          some: {
            id: workspaceId,
          },
        } : undefined,
      },
      select: {
        type: true,
      },
      distinct: ['type'],
    });

    return HierarchiesTypesModelMapper.toModel(result)

  }

}
