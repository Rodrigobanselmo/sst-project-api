import { ActionPlanRepository } from '@/@v2/security/action-plan/database/repositories/action-plan/action-plan.repository'
import { Injectable } from '@nestjs/common'
import { IEditActionPlanService } from './edit-action-plan.service.types'

@Injectable()
export class EditActionPlanService {
  constructor(
    private readonly actionPlanRepository: ActionPlanRepository
  ) { }

  async update(params: IEditActionPlanService.Params) {
    const actionPlan = await this.actionPlanRepository.findById({
      companyId: params.companyId,
      recommendationId: params.recommendationId,
      riskDataId: params.riskDataId,
      workspaceId: params.workspaceId
    })

    actionPlan.responsibleId = params.responsibleId

    if (params.validDate !== undefined) {
      actionPlan.setValidDate({
        validDate: params.validDate,
        comment: {
          text: params.comment.text,
          textType: params.comment.textType,
          commentedById: params.userId
        }
      })
    }

    if (params.status) {
      actionPlan.setStatus({
        status: params.status,
        comment: {
          text: params.comment.text,
          textType: params.comment.textType,
          commentedById: params.userId
        }
      })
    }

    return actionPlan
  }
}
