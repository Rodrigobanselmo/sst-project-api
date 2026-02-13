import { Injectable } from '@nestjs/common'
import { IReadVisualIdentityUseCase } from './read-visual-identity.types'
import { VisualIdentityDAO } from '@/@v2/enterprise/company/database/dao/visual-identity/visual-identity.dao'

@Injectable()
export class ReadVisualIdentityUseCase {
  constructor(private readonly visualIdentityDAO: VisualIdentityDAO) {}

  async execute(params: IReadVisualIdentityUseCase.Params): Promise<IReadVisualIdentityUseCase.Result> {
    const data = await this.visualIdentityDAO.read({
      companyId: params.companyId,
    })

    return data
  }
}

