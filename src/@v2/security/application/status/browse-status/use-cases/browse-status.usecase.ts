import { StatusDAO } from '@/@v2/security/database/dao/status/status.dao'
import { Injectable } from '@nestjs/common'
import { IBrowseStatusUseCase } from './browse-status.types'

@Injectable()
export class BrowseStatusUseCase {
  constructor(
    private readonly statusDAO: StatusDAO
  ) { }

  async execute(params: IBrowseStatusUseCase.Params) {
    return await this.statusDAO.browse({
      companyId: params.companyId,
      type: params.type,
    })

  }
}
