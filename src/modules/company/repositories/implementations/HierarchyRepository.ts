/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateHierarchyDto } from '../../dto/hierarchy';
import { HierarchyEntity } from '../../entities/hierarchy.entity';

@Injectable()
export class HierarchyRepository {
  constructor(private prisma: PrismaService) {}

  async findAllHierarchyByCompany(companyId: string) {
    const hierarchies = await this.prisma.hierarchy.findMany({
      where: { companyId },
    });

    return hierarchies.map((hierarchy) => new HierarchyEntity(hierarchy));
  }

  async upsertMany(
    upsertHierarchyMany: (CreateHierarchyDto & { id: string })[],
    companyId: string,
  ): Promise<HierarchyEntity[]> {
    const data = await this.prisma.$transaction(
      upsertHierarchyMany.map(
        ({ companyId: _, id, workplaceId, parentId, ...upsertHierarchy }) =>
          this.prisma.hierarchy.upsert({
            create: {
              ...upsertHierarchy,
              company: { connect: { id: companyId } },
              workplace: {
                connect: { id_companyId: { companyId, id: workplaceId } },
              },
              parent: {
                connect: { id_companyId: { companyId, id: parentId } },
              },
            },
            update: {
              ...upsertHierarchy,
              workplace: !workplaceId
                ? undefined
                : {
                    connect: { id_companyId: { companyId, id: workplaceId } },
                  },
              parent: !parentId
                ? undefined
                : {
                    connect: { id_companyId: { companyId, id: parentId } },
                  },
            },
            where: { id_companyId: { companyId, id: id || 'none' } },
          }),
      ),
    );

    return data.map((hierarchy) => new HierarchyEntity(hierarchy));
  }
}
