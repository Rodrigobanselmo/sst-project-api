import { ActionPlanInfoAggregateRepository } from '@/@v2/security/action-plan/database/repositories/action-plan-info/action-plan-aggregate.repository';
import { CoordinatorRepository } from '@/@v2/security/action-plan/database/repositories/coordinator/coordinator.repository';
import { Injectable } from '@nestjs/common';
import { IEditActionPlanInfoUseCase } from './edit-action-plan-info.types';
import { ActionPlanInfoAggregate } from '@/@v2/security/action-plan/domain/aggregations/action-plan-info.aggregate';
import { ActionPlanInfoEntity } from '@/@v2/security/action-plan/domain/entities/action-plan-info.entity';
import { CoordinatorEntity } from '@/@v2/security/action-plan/domain/entities/coordinator.entity';

@Injectable()
export class EditActionPlanInfoUseCase {
  constructor(
    private readonly coordinatorRepository: CoordinatorRepository,
    private readonly actionPlanInfoAggregateRepository: ActionPlanInfoAggregateRepository,
  ) {}

  async execute(params: IEditActionPlanInfoUseCase.Params) {
    let [aggregate, coordinator] = await Promise.all([
      this.actionPlanInfoAggregateRepository.findById({ companyId: params.companyId, workspaceId: params.workspaceId }),
      params.coordinatorId ? this.coordinatorRepository.findById({ companyId: params.companyId, coordinatorId: params.coordinatorId }) : undefined,
    ]);

    if (!aggregate) {
      await this._createActionPlanInfo(params, coordinator);
    } else {
      await this._updateActionPlanInfo(params, aggregate, coordinator);
    }
  }

  private async _createActionPlanInfo(params: IEditActionPlanInfoUseCase.Params, coordinator?: CoordinatorEntity) {
    const actionPlanInfo = new ActionPlanInfoEntity({
      companyId: params.companyId,
      workspaceId: params.workspaceId,
      validityStart: params.validityStart,
      validityEnd: params.validityEnd,
      monthsLevel_2: params.monthsLevel_2,
      monthsLevel_3: params.monthsLevel_3,
      monthsLevel_4: params.monthsLevel_4,
      monthsLevel_5: params.monthsLevel_5,
    });

    const newAggregate = new ActionPlanInfoAggregate({
      actionPlanInfo,
      coordinator,
    });

    await this.actionPlanInfoAggregateRepository.create(newAggregate);
  }

  private async _updateActionPlanInfo(params: IEditActionPlanInfoUseCase.Params, aggregate: ActionPlanInfoAggregate, coordinator?: CoordinatorEntity) {
    aggregate.actionPlanInfo.update({
      validityStart: params.validityStart,
      validityEnd: params.validityEnd,
      monthsLevel_2: params.monthsLevel_2,
      monthsLevel_3: params.monthsLevel_3,
      monthsLevel_4: params.monthsLevel_4,
      monthsLevel_5: params.monthsLevel_5,
    });

    if (coordinator) aggregate.coordinator = coordinator;
    if (params.coordinatorId == null) aggregate.coordinator = null;

    await this.actionPlanInfoAggregateRepository.update(aggregate);
  }
}
