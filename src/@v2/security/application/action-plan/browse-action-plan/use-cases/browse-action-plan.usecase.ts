import { Injectable } from '@nestjs/common'
import { IBrowseActionPlanUseCase } from './browse-action-plan.types'
import { ActionPlanDAO } from '@/@v2/security/database/dao/action-plan/action-plan.dao'

@Injectable()
export class BrowseActionPlanUseCase {
  constructor(
    private readonly actionplanDAO: ActionPlanDAO
  ) { }

  async execute(params: IBrowseActionPlanUseCase.Params) {
    const data = await this.actionplanDAO.browse({
      page: params.pagination.page,
      limit: params.pagination.limit,
      orderBy: params.orderBy,
      filters: {
        companyId: params.companyId,
        workspaceIds: params.workspaceIds,
        search: params.search,
      }
    })

    return data

  }
}
