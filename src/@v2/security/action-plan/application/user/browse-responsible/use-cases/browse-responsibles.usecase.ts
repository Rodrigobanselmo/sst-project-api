import { UserDAO } from '@/@v2/security/action-plan/database/dao/user/user.dao'
import { Injectable } from '@nestjs/common'
import { IBrowseResponsiblesUseCase } from './browse-responsibles.types'

@Injectable()
export class BrowseResponsiblesUseCase {
  constructor(
    private readonly responsibleDAO: UserDAO
  ) { }

  async execute(params: IBrowseResponsiblesUseCase.Params) {
    const data = await this.responsibleDAO.browse({
      page: params.pagination.page,
      limit: params.pagination.limit,
      orderBy: params.orderBy,
      filters: {
        companyId: params.companyId,
        search: params.search,
      }
    })

    return data

  }
}
