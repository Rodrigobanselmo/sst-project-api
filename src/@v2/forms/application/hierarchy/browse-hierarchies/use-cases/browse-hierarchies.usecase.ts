import { Injectable } from '@nestjs/common';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { IBrowseHierarchiesUseCase } from './browse-hierarchies.types';
import { StatusEnum } from '@prisma/client';

@Injectable()
export class BrowseHierarchiesUseCase {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async execute(params: IBrowseHierarchiesUseCase.Params): Promise<IBrowseHierarchiesUseCase.Result[]> {
    const hierarchies = await this.prisma.hierarchy.findMany({
      where: {
        companyId: params.companyId,
        status: StatusEnum.ACTIVE,
        deletedAt: null,
        ...(params.type?.length && {
          type: {
            in: params.type,
          },
        }),
        ...(params.parent !== undefined && {
          parentId: params.parent === 'null' ? null : params.parent,
        }),
      },
      select: {
        id: true,
        name: true,
        type: true,
        parentId: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return hierarchies.map(hierarchy => ({
      id: hierarchy.id,
      name: hierarchy.name,
      type: hierarchy.type as any,
      parentId: hierarchy.parentId || undefined,
    }));
  }
}
