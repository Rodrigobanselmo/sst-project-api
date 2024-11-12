import { ActionPlanAggregateRepository } from '@/@v2/security/action-plan/database/repositories/action-plan/action-plan-aggregate.repository'
import { Injectable } from '@nestjs/common'
import { IEditActionPlanService } from './edit-action-plan.service.types'

@Injectable()
export class EditActionPlanService {
  constructor(
    private readonly actionPlanAggregateRepository: ActionPlanAggregateRepository
  ) { }

  async update(params: IEditActionPlanService.Params) {
    const aggregare = await this.actionPlanAggregateRepository.findById({
      companyId: params.companyId,
      recommendationId: params.recommendationId,
      riskDataId: params.riskDataId,
      workspaceId: params.workspaceId
    })

    aggregare.actionPlan.responsibleId = params.responsibleId

    if (params.validDate !== undefined) {
      aggregare.setValidDate({
        validDate: params.validDate,
        comment: {
          text: params.comment.text,
          textType: params.comment.textType,
          commentedById: params.userId
        }
      })
    }

    if (params.status) {
      aggregare.setStatus({
        status: params.status,
        comment: {
          text: params.comment.text,
          textType: params.comment.textType,
          commentedById: params.userId
        }
      })
    }

    return aggregare
  }
}
