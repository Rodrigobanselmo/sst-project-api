import { ActionPlanInfoAggregate } from '../../../domain/aggregations/action-plan-info.aggregate';
import { ActionPlanInfoMapper, IActionPlanInfoMapper } from '../entities/action-plan-info.mapper';
import { CoordinatorMapper, ICoordinatorMapper } from '../entities/coordinator.mapper';

type IActionPlanInfoAggregateMapper = IActionPlanInfoMapper & {
  coordinator: ICoordinatorMapper | null
}

export class ActionPlanInfoAggregateMapper {
  static toAggregate(data: IActionPlanInfoAggregateMapper): ActionPlanInfoAggregate {
    return new ActionPlanInfoAggregate({
      actionPlanInfo: ActionPlanInfoMapper.toEntity(data),
      coordinator: data.coordinator ? CoordinatorMapper.toEntity(data.coordinator) : null
    })
  }
}
