import { CommentAggregate } from '../../../domain/aggregations/comment.aggregate';
import { ActionPlanMapper, IActionPlanEntityMapper } from '../entities/action-plan.mapper';
import { CommentMapper, ICommentEntityMapper } from '../entities/comment.mapper';
import { CoordinatorMapper, ICoordinatorMapper } from '../entities/coordinator.mapper';

type ICommentAggregateMapper = ICommentEntityMapper & {
  riskFactorDataRec: IActionPlanEntityMapper & {
    riskFactorData: {
      level: number | null;
    };
    workspace: {
      documentData: {
        months_period_level_2: number;
        months_period_level_3: number;
        months_period_level_4: number;
        months_period_level_5: number;
        validityStart: Date | null;
        coordinator: ICoordinatorMapper | null;
      }[];
    };
  };
};

export class CommentAggregateMapper {
  static toAggregate(data: ICommentAggregateMapper): CommentAggregate {
    const documentData = data.riskFactorDataRec.workspace.documentData[0];

    return new CommentAggregate({
      coordinator: documentData.coordinator ? CoordinatorMapper.toEntity(documentData.coordinator) : null,
      comment: CommentMapper.toEntity(data),
      actionPlan: ActionPlanMapper.toEntity(data.riskFactorDataRec, {
        documentData,
        level: data.riskFactorDataRec.riskFactorData.level,
      }),
    });
  }
}
