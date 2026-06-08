import { ActionPlanAggregateRepository } from '@/@v2/security/action-plan/database/repositories/action-plan/action-plan-aggregate.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IEditActionPlanEffectivenessService } from './edit-action-plan-effectiveness.service.types';

@Injectable()
export class EditActionPlanEffectivenessService {
  constructor(private readonly actionPlanAggregateRepository: ActionPlanAggregateRepository) {}

  async update(params: IEditActionPlanEffectivenessService.Params) {
    const aggregate = await this.actionPlanAggregateRepository.findById({
      companyId: params.companyId,
      recommendationId: params.recommendationId,
      riskDataId: params.riskDataId,
      workspaceId: params.workspaceId,
    });

    if (!aggregate) return null;

    const [, effectivenessError] = aggregate.setEffectiveness({
      effectivenessStatus: params.effectivenessStatus,
      effectivenessComment: params.effectivenessComment,
      evaluatedById: params.userId,
    });

    if (effectivenessError) throw new BadRequestException(effectivenessError.message);

    return aggregate;
  }
}
