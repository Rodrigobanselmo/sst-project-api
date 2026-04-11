import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';

export namespace IUpsertHierarchyGroupsUseCase {
  export type GroupInput = {
    id?: string;
    name: string;
    hierarchyIds: string[];
  };

  export type Params = {
    companyId: string;
    applicationId: string;
    groups: GroupInput[];
  };
}

@Injectable()
export class UpsertHierarchyGroupsUseCase {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async execute(params: IUpsertHierarchyGroupsUseCase.Params) {
    // Validate form application exists
    const formApplication = await this.prisma.formApplication.findFirst({
      where: {
        id: params.applicationId,
        company_id: params.companyId,
        deleted_at: null,
      },
    });

    if (!formApplication) {
      throw new NotFoundException('Aplicação de formulário não encontrada');
    }

    // Validate no hierarchy appears in more than one group
    const allHierarchyIds = params.groups.flatMap((g) => g.hierarchyIds);
    const uniqueHierarchyIds = new Set(allHierarchyIds);
    if (uniqueHierarchyIds.size !== allHierarchyIds.length) {
      throw new BadRequestException('Um setor não pode pertencer a mais de um grupo');
    }

    // Validate all hierarchy IDs belong to the company
    if (uniqueHierarchyIds.size > 0) {
      const validHierarchies = await this.prisma.hierarchy.count({
        where: {
          id: { in: Array.from(uniqueHierarchyIds) },
          companyId: params.companyId,
        },
      });

      if (validHierarchies !== uniqueHierarchyIds.size) {
        throw new BadRequestException('Um ou mais setores não pertencem a esta empresa');
      }
    }

    // Transaction: delete all existing groups, create new ones
    return this.prisma.$transaction(async (tx) => {
      // Delete existing groups for this application
      await tx.formApplicationHierarchyGroupItem.deleteMany({
        where: {
          group: {
            form_application_id: params.applicationId,
          },
        },
      });

      await tx.formApplicationHierarchyGroup.deleteMany({
        where: {
          form_application_id: params.applicationId,
        },
      });

      // Create new groups
      const createdGroups = [];
      for (const group of params.groups) {
        const created = await tx.formApplicationHierarchyGroup.create({
          data: {
            name: group.name,
            form_application_id: params.applicationId,
            hierarchies: {
              create: group.hierarchyIds.map((hierarchyId) => ({
                hierarchy_id: hierarchyId,
              })),
            },
          },
          select: {
            id: true,
            name: true,
            hierarchies: {
              select: {
                hierarchy_id: true,
              },
            },
          },
        });

        createdGroups.push({
          id: created.id,
          name: created.name,
          hierarchyIds: created.hierarchies.map((h) => h.hierarchy_id),
        });
      }

      return createdGroups;
    });
  }
}
