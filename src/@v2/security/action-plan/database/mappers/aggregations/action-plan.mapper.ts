import { ActionPlanAggregate } from '../../../domain/aggregations/action-plan.aggregate';
import { ActionPlanMapper, IActionPlanEntityMapper } from '../entities/action-plan.mapper';
import { CommentMapper, ICommentEntityMapper } from '../entities/comment.mapper';
import { CoordinatorMapper, ICoordinatorMapper } from '../entities/coordinator.mapper';

type IActionPlanAggregateMapper = IActionPlanEntityMapper & {
  comments: ICommentEntityMapper[]
  company: {
    documentData: {
      coordinator: ICoordinatorMapper
    }[]
  }
}

export class ActionPlanAggregateMapper {
  static toAggregate(data: IActionPlanAggregateMapper): ActionPlanAggregate {
    const coordenator = data.company.documentData?.[0]?.coordinator
    return new ActionPlanAggregate({
      actionPlan: ActionPlanMapper.toEntity(data),
      comments: CommentMapper.toArrayEntity(data.comments),
      coordinator: coordenator ? CoordinatorMapper.toEntity(coordenator) : null
    })
  }
}
