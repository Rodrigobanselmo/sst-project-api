import { CommentAggregate } from '../../../domain/aggregations/comment.aggregate';
import { ActionPlanMapper, IActionPlanEntityMapper } from '../entities/action-plan.mapper';
import { CommentMapper, ICommentEntityMapper } from '../entities/comment.mapper';

type ICommentAggregateMapper = ICommentEntityMapper & {
  riskFactorDataRec: IActionPlanEntityMapper
}

export class CommentAggregateMapper {
  static toAggregate(data: ICommentAggregateMapper): CommentAggregate {
    return new CommentAggregate({
      comment: CommentMapper.toEntity(data),
      actionPlan: ActionPlanMapper.toEntity(data.riskFactorDataRec),
    })
  }
}
