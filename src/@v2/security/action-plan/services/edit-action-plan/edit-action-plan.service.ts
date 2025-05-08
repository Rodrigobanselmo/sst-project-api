import { ActionPlanAggregateRepository } from '@/@v2/security/action-plan/database/repositories/action-plan/action-plan-aggregate.repository';
import { Injectable } from '@nestjs/common';
import { IEditActionPlanService } from './edit-action-plan.service.types';

@Injectable()
export class EditActionPlanService {
  constructor(private readonly actionPlanAggregateRepository: ActionPlanAggregateRepository) {}

  async update(params: IEditActionPlanService.Params) {
    const aggregate = await this.actionPlanAggregateRepository.findById({
      companyId: params.companyId,
      recommendationId: params.recommendationId,
      riskDataId: params.riskDataId,
      workspaceId: params.workspaceId,
    });

    if (!aggregate) return null;

    aggregate.actionPlan.responsibleId = params.responsibleId;

    if (params.validDate !== undefined) {
      aggregate.setValidDate({
        validDate: params.validDate,
        comment: {
          text: params.comment?.text,
          textType: params.comment?.textType,
          commentedById: params.userId,
        },
      });
    }

    if (params.status) {
      aggregate.setStatus({
        status: params.status,
        comment: {
          text: params.comment?.text,
          textType: params.comment?.textType,
          commentedById: params.userId,
        },
      });
    }

    return aggregate;
  }
}
