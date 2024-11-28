import { ActionPlanAggregateRepository } from '@/@v2/security/action-plan/database/repositories/action-plan/action-plan-aggregate.repository'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context'
import { SharedTokens } from '@/@v2/shared/constants/tokens'
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum'
import { IEditManyActionPlanUseCase } from './edit-many-action-plan.types'
import { EditActionPlanService } from '@/@v2/security/action-plan/services/edit-action-plan/edit-action-plan.service'
import { asyncBatch } from '@/@v2/shared/utils/helpers/asyncBatch'

@Injectable()
export class EditManyActionPlanUseCase {
  constructor(
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly editActionPlanService: EditActionPlanService,
    private readonly actionPlanRepository: ActionPlanAggregateRepository
  ) { }

  async execute(params: IEditManyActionPlanUseCase.Params) {
    const loggedUser = this.context.get<UserContext>(ContextKey.USER)

    const actionsPlans = await asyncBatch({
      items: params.ids,
      batchSize: 10,
      callback: async ({ riskDataId, recommendationId, workspaceId }) => {
        const actionPlan = await this.editActionPlanService.update({
          companyId: params.companyId,
          userId: loggedUser.id,
          recommendationId,
          riskDataId,
          workspaceId,
          responsibleId: params.responsibleId,
          validDate: params.validDate,
          status: params.status,
          comment: params.comment
        })

        if (!actionPlan) throw new BadRequestException('Plano de ação não encontrado')
        return actionPlan
      }
    })

    await this.actionPlanRepository.updateMany(actionsPlans)
  }
}
