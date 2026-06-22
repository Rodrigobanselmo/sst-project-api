import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { formApplicationAccessWhere } from '@/@v2/forms/application/shared/helpers/form-application-access.helper';
import { FormApplicationScopeService } from '@/@v2/forms/application/shared/services/form-application-scope.service';

export namespace IUpsertHierarchyGroupsUseCase {
  export type GroupInput = {
    id?: string;
    name: string;
    description?: string | null;
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
  constructor(
    private readonly prisma: PrismaServiceV2,
    private readonly formApplicationScopeService: FormApplicationScopeService,
  ) {}

  async execute(params: IUpsertHierarchyGroupsUseCase.Params) {
    const formApplication = await this.prisma.formApplication.findFirst({
      where: formApplicationAccessWhere({
        formApplicationId: params.applicationId,
        accessCompanyId: params.companyId,
      }),
    });

    if (!formApplication) {
      throw new NotFoundException('Aplicação de formulário não encontrada');
    }

    const scope = await this.formApplicationScopeService.resolve({
      formApplicationId: params.applicationId,
      accessCompanyId: params.companyId,
    });
    const participantCompanyIds =
      this.formApplicationScopeService.participantCompanyIdsForScope(scope);

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
          companyId: { in: participantCompanyIds },
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
            description: group.description?.trim() || null,
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
            description: true,
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
          description: created.description,
          hierarchyIds: created.hierarchies.map((h) => h.hierarchy_id),
        });
      }

      return createdGroups;
    });
  }
}
