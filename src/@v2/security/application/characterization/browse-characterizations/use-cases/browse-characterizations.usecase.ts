import { Injectable } from '@nestjs/common'
import { IBrowseCharacterizationUseCase } from './browse-characterizations.types'
import { RiskRepository } from '@/@v2/security/database/repositories/risk/risk.repository'
import { CharacterizationDAO } from '@/@v2/security/database/dao/characterization/characterization.dao'

@Injectable()
export class BrowseCharacterizationUseCase {
  constructor(
    private readonly characterizationDAO: CharacterizationDAO
  ) { }

  async execute(params: IBrowseCharacterizationUseCase.Params) {
    return await this.characterizationDAO.browse({
      page: params.pagination.page,
      limit: params.pagination.limit,
      orderBy: params.orderBy,
      filters: {
        companyId: params.companyId,
        workspaceId: params.workspaceId,
        search: params.search
      }
    })

  }
}
