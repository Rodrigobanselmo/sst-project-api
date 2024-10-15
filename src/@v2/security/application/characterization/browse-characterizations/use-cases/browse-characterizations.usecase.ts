import { CharacterizationDAO } from '@/@v2/security/database/dao/characterization/characterization.dao'
import { Injectable } from '@nestjs/common'
import { IBrowseCharacterizationUseCase } from './browse-characterizations.types'

@Injectable()
export class BrowseCharacterizationUseCase {
  constructor(
    private readonly characterizationDAO: CharacterizationDAO
  ) { }

  async execute(params: IBrowseCharacterizationUseCase.Params) {
    const data = await this.characterizationDAO.browse({
      page: params.pagination.page,
      limit: params.pagination.limit,
      orderBy: params.orderBy,
      filters: {
        companyId: params.companyId,
        workspaceId: params.workspaceId,
        search: params.search,
        stageIds: params.stageIds
      }
    })

    return data

  }
}
