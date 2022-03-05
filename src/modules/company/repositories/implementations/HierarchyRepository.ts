/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Hierarchy } from '@prisma/client';
import { IPrismaOptions } from 'src/shared/interfaces/prisma-options.types';
import { transformStringToObject } from 'src/shared/utils/transformStringToObject';

import { PrismaService } from '../../../../prisma/prisma.service';
import { HierarchyEntity } from '../../entities/hierarchy.entity';

@Injectable()
export class HierarchyRepository {
  constructor(private prisma: PrismaService) {}

  async findHierarchyTreeByCompany(companyId: string) {
    const hierarchies = await this.prisma.hierarchy.findMany({
      where: { companyId },
    });

    const hierarchyEntities = hierarchies.map(
      (employee) => new HierarchyEntity(employee),
    );

    const hierarchyTree = hierarchyEntities.reduce((acc, node) => {
      acc[node.id] = {
        ...node,
        parentId: node.parentId || null,
        children: [],
      };

      return acc;
    }, {}) as Record<string, Hierarchy & { children: (string | number)[] }>;

    Object.values(hierarchyTree).forEach((node) => {
      if (node.parentId) {
        hierarchyTree[node.parentId].children.push(node.id);
      }
    });

    return hierarchyTree;
  }
}
