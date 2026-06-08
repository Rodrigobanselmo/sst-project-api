import { ActionPlanAggregateRepository } from '@/@v2/security/action-plan/database/repositories/action-plan/action-plan-aggregate.repository';
import { EditActionPlanEffectivenessService } from '@/@v2/security/action-plan/services/edit-action-plan-effectiveness/edit-action-plan-effectiveness.service';
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IEditActionPlanEffectivenessUseCase } from './edit-action-plan-effectiveness.types';

@Injectable()
export class EditActionPlanEffectivenessUseCase {
  constructor(
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly editActionPlanEffectivenessService: EditActionPlanEffectivenessService,
    private readonly actionPlanRepository: ActionPlanAggregateRepository,
  ) {}

  async execute(params: IEditActionPlanEffectivenessUseCase.Params) {
    const loggedUser = this.context.get<UserContext>(ContextKey.USER);
    const actionPlan = await this.editActionPlanEffectivenessService.update({
      userId: loggedUser.id,
      ...params,
    });

    if (!actionPlan) throw new BadRequestException('Plano de ação não encontrado');

    await this.actionPlanRepository.update(actionPlan);
  }
}
