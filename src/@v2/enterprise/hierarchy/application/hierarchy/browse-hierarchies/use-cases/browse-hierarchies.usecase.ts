import { HierarchyDAO } from '@/@v2/security/action-plan/database/dao/hierarchy/hierarchy.dao';
import { Injectable } from '@nestjs/common';
import { IBrowseHierarchiesUseCase } from './browse-hierarchies.types';

@Injectable()
export class BrowseHierarchiesUseCase {
  constructor(private readonly hierarchyDAO: HierarchyDAO) {}

  async execute(params: IBrowseHierarchiesUseCase.Params) {
    const data = await this.hierarchyDAO.browseShort({
      page: params.pagination.page,
      limit: params.pagination.limit,
      filters: {
        companyId: params.companyId,
        search: params.search,
        workspaceIds: params.workspaceIds,
        // type: [HierarchyTypeEnum.OFFICE]
      },
    });

    return data;
  }
}
