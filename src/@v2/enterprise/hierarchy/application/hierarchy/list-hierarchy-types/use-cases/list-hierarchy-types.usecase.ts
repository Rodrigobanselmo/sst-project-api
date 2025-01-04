import { Injectable } from '@nestjs/common'
import { IListHierarchyTypesUseCase } from './list-hierarchy-types.types'
import { HierarchyDAO } from '@/@v2/enterprise/hierarchy/database/dao/hierarchy/hierarchy.dao'

@Injectable()
export class ListHierarchyTypesUseCase {
  constructor(
    private readonly hierarchyDAO: HierarchyDAO
  ) { }

  async execute(params: IListHierarchyTypesUseCase.Params) {
    const data = await this.hierarchyDAO.findTypes({
      companyId: params.companyId,
      workspaceId: params.workspaceId
    })

    return data

  }
}
