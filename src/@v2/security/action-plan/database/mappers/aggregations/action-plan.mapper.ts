import { StatusEnum } from '@prisma/client';
import { ActionPlanAggregate } from '../../../domain/aggregations/action-plan.aggregate';
import { ActionPlanMapper, IActionPlanEntityMapper } from '../entities/action-plan.mapper';
import { CommentMapper, ICommentEntityMapper } from '../entities/comment.mapper';
import { CoordinatorMapper, ICoordinatorMapper } from '../entities/coordinator.mapper';

type IActionPlanAggregateMapper = {
  companyId: string;
  workspaceId: string;
  riskDataId: string;
  recommendationId: string;
  company: {
    documentData: {
      coordinator: ICoordinatorMapper
    }[]
  }
  dataRecs: ((IActionPlanEntityMapper & {
    comments: ICommentEntityMapper[]
  }) | null)[]
}

export class ActionPlanAggregateMapper {
  static toAggregate(data: IActionPlanAggregateMapper): ActionPlanAggregate {
    const coordenator = data.company.documentData?.[0]?.coordinator
    const dataRec = data.dataRecs[0] || {
      companyId: data.companyId,
      recMedId: data.recommendationId,
      riskFactorDataId: data.riskDataId,
      workspaceId: data.workspaceId,
      status: StatusEnum.PENDING,
      comments: []
    } satisfies IActionPlanAggregateMapper['dataRecs'][0]

    return new ActionPlanAggregate({
      actionPlan: ActionPlanMapper.toEntity(dataRec),
      comments: CommentMapper.toArrayEntity(dataRec.comments),
      coordinator: coordenator ? CoordinatorMapper.toEntity(coordenator) : null
    })
  }
}
