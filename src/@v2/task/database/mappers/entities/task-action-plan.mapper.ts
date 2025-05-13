import { TaskActionPlanEntity } from '@/@v2/task/domain/entities/task-action-plan.entity';
import { RiskFactorDataRec } from '@prisma/client';

export type ITaskActionPlanEntityMapper = RiskFactorDataRec;

export class TaskActionPlanMapper {
  static toEntity(data: ITaskActionPlanEntityMapper): TaskActionPlanEntity {
    return new TaskActionPlanEntity({
      id: data.id,
      companyId: data.companyId,
      recommendationId: data.recMedId,
      riskDataId: data.riskFactorDataId,
      workspaceId: data.workspaceId,
    });
  }
}
