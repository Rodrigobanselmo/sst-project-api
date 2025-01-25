import { ActionPlanInfoAggregateRepository } from '@/@v2/security/action-plan/database/repositories/action-plan-info/action-plan-aggregate.repository';
import { CoordinatorRepository } from '@/@v2/security/action-plan/database/repositories/coordinator/coordinator.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IEditActionPlanInfoUseCase } from './edit-action-plan-info.types';

@Injectable()
export class EditActionPlanInfoUseCase {
  constructor(
    private readonly coordinatorRepository: CoordinatorRepository,
    private readonly actionPlanInfoAggregateRepository: ActionPlanInfoAggregateRepository,
  ) {}

  async execute(params: IEditActionPlanInfoUseCase.Params) {
    const [aggregate, coordinator] = await Promise.all([
      this.actionPlanInfoAggregateRepository.findById({ companyId: params.companyId, workspaceId: params.workspaceId }),
      params.coordinatorId ? this.coordinatorRepository.findById({ companyId: params.companyId, coordinatorId: params.coordinatorId }) : undefined,
    ]);

    if (!aggregate) throw new BadRequestException('Plano de ação não encontrado');

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
