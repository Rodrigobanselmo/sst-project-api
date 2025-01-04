import { ActionPlanInfoDAO } from '@/@v2/security/action-plan/database/dao/action-plan-info/action-plan-info.dao'
import { Injectable } from '@nestjs/common'
import { IFindActionPlanInfoUseCase } from './find-action-plan-info.types'

@Injectable()
export class ReadActionPlanInfoUseCase {
  constructor(
    private readonly actionPlanInfoDAO: ActionPlanInfoDAO
  ) { }

  async execute(params: IFindActionPlanInfoUseCase.Params) {
    const data = await this.actionPlanInfoDAO.find({
      companyId: params.companyId,
      workspaceId: params.workspaceId,
    })

    return data

  }
}
