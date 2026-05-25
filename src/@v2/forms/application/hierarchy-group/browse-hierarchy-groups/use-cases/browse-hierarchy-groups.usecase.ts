import { formApplicationNestedAccessWhere } from '@/@v2/forms/application/shared/helpers/form-application-access.helper';
import { Injectable } from '@nestjs/common';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';

export namespace IBrowseHierarchyGroupsUseCase {
  export type Params = {
    companyId: string;
    applicationId: string;
  };
}

@Injectable()
export class BrowseHierarchyGroupsUseCase {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async execute(params: IBrowseHierarchyGroupsUseCase.Params) {
    const groups = await this.prisma.formApplicationHierarchyGroup.findMany({
      where: {
        form_application_id: params.applicationId,
        form_application: formApplicationNestedAccessWhere(params.companyId),
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
      orderBy: { created_at: 'asc' },
    });

    return groups.map((group) => ({
      id: group.id,
      name: group.name,
      hierarchyIds: group.hierarchies.map((h) => h.hierarchy_id),
    }));
  }
}
