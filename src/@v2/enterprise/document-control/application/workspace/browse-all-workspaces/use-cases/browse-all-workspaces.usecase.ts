import { Injectable } from '@nestjs/common'
import { IBrowseWorkspaceUseCase } from './browse-all-workspaces.types'
import { WorkspaceDAO } from '@/@v2/enterprise/company/database/dao/workspace/workspace.dao'

@Injectable()
export class BrowseWorkspaceUseCase {
  constructor(
    private readonly workspaceDAO: WorkspaceDAO
  ) { }

  async execute(params: IBrowseWorkspaceUseCase.Params) {
    const data = await this.workspaceDAO.browseAll({
      orderBy: params.orderBy,
      filters: {
        companyId: params.companyId,
      }
    })

    return data

  }
}
