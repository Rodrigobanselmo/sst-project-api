import { StatusEnum } from '@prisma/client';
import { ActionPlanAggregate } from '../../../domain/aggregations/action-plan.aggregate';
import { ActionPlanMapper, IActionPlanEntityMapper } from '../entities/action-plan.mapper';
import { CommentMapper, ICommentEntityMapper } from '../entities/comment.mapper';
import { CoordinatorMapper, ICoordinatorMapper } from '../entities/coordinator.mapper';

type IActionPlanAggregateMapper = {
  level: number | null;
  companyId: string;
  workspaceId: string;
  riskDataId: string;
  recommendationId: string;
  company: {
    documentData: {
      months_period_level_2: number;
      months_period_level_3: number;
      months_period_level_4: number;
      months_period_level_5: number;
      validityStart: Date | null;
      coordinator: ICoordinatorMapper;
    }[];
  };
  dataRecs: (
    | (IActionPlanEntityMapper & {
        comments: ICommentEntityMapper[];
      })
    | null
  )[];
};

export class ActionPlanAggregateMapper {
  static toAggregate(data: IActionPlanAggregateMapper): ActionPlanAggregate {
    const documentData = data.company.documentData?.[0];
    const coordinator = documentData?.coordinator;
    const dataRec =
      data.dataRecs[0] ||
      ({
        companyId: data.companyId,
        recMedId: data.recommendationId,
        riskFactorDataId: data.riskDataId,
        workspaceId: data.workspaceId,
        status: StatusEnum.PENDING,
        comments: [],
      } satisfies IActionPlanAggregateMapper['dataRecs'][0]);

    return new ActionPlanAggregate({
      actionPlan: ActionPlanMapper.toEntity(dataRec, {
        documentData,
        level: data.level,
      }),
      comments: CommentMapper.toArrayEntity(dataRec.comments),
      coordinator: coordinator ? CoordinatorMapper.toEntity(coordinator) : null,
    });
  }
}
