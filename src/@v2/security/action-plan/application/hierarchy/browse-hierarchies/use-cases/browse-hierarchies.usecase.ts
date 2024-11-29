import { Injectable } from '@nestjs/common'
import { IBrowseHierarchiesUseCase } from './browse-hierarchies.types'
import { HierarchyDAO } from '@/@v2/security/action-plan/database/dao/hierarchy/hierarchy.dao'

@Injectable()
export class BrowseHierarchiesUseCase {
  constructor(
    private readonly hierarchyDAO: HierarchyDAO
  ) { }

  async execute(params: IBrowseHierarchiesUseCase.Params) {
    const data = await this.hierarchyDAO.browse({
      page: params.pagination.page,
      limit: params.pagination.limit,
      orderBy: params.orderBy,
      filters: {
        companyId: params.companyId,
        search: params.search,
        workspaceIds: params.workspaceIds
      }
    })

    return data

  }
}
