import { ActionPlanAggregateRepository } from '@/@v2/security/action-plan/database/repositories/action-plan/action-plan-aggregate.repository'
import { EditActionPlanService } from '@/@v2/security/action-plan/services/edit-action-plan/edit-action-plan.service'
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context'
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum'
import { SharedTokens } from '@/@v2/shared/constants/tokens'
import { Inject, Injectable } from '@nestjs/common'
import { IEditActionPlanUseCase } from './edit-action-plan.types'

@Injectable()
export class EditActionPlanUseCase {
  constructor(
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly editActionPlanService: EditActionPlanService,
    private readonly actionPlanRepository: ActionPlanAggregateRepository,
  ) { }

  async execute(params: IEditActionPlanUseCase.Params) {
    const loggedUser = this.context.get<UserContext>(ContextKey.USER)
    const actionPlan = await this.editActionPlanService.update({
      userId: loggedUser.id,
      comment: params.comment,
      ...params,
    })

    await this.actionPlanRepository.update(actionPlan)
  }
}
