import { ActionPlanAggregateRepository } from '@/@v2/security/action-plan/database/repositories/action-plan/action-plan-aggregate.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
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

    if (params.responsibleId !== undefined) {
      aggregate.actionPlan.responsibleId = params.responsibleId;
    }

    if (params.monitoringMethod !== undefined || params.resultCriteria !== undefined) {
      const [, planningError] = aggregate.setPlanning({
        monitoringMethod: params.monitoringMethod,
        resultCriteria: params.resultCriteria,
      });

      if (planningError) throw new BadRequestException(planningError.message);
    }

    if (params.validDate !== undefined) {
      const [, validDateError] = aggregate.setValidDate({
        validDate: params.validDate,
        comment: {
          text: params.comment?.text,
          textType: params.comment?.textType,
          commentedById: params.userId,
        },
      });

      if (validDateError) throw new BadRequestException(validDateError.message);
    }

    if (params.status) {
      const [, statusError] = aggregate.setStatus({
        status: params.status,
        comment: {
          text: params.comment?.text,
          textType: params.comment?.textType,
          commentedById: params.userId,
        },
      });

      if (statusError) throw new BadRequestException(statusError.message);
    }

    return aggregate;
  }
}
