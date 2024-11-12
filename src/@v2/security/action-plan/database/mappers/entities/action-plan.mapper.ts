import { StatusEnum } from '@prisma/client';
import { ActionPlanEntity } from '../../../domain/entities/action-plan.entity';
import { ActionPlanStatusEnum } from '../../../domain/enums/action-plan-status.enum';

export type IActionPlanEntityMapper = {
  companyId: string
  recMedId: string
  riskFactorDataId: string
  workspaceId: string
  status: StatusEnum;
  startDate?: Date | null
  doneDate?: Date | null
  canceledDate?: Date | null
  responsibleId?: number | null
  endDate: Date | null
}

export class ActionPlanMapper {
  static toEntity(data: IActionPlanEntityMapper): ActionPlanEntity {
    return new ActionPlanEntity({
      companyId: data.companyId,
      recommendationId: data.recMedId,
      riskDataId: data.riskFactorDataId,
      workspaceId: data.workspaceId,
      status: ActionPlanStatusEnum[data.status],
      startDate: data.startDate,
      doneDate: data.doneDate,
      canceledDate: data.canceledDate,
      responsibleId: data.responsibleId,
      validDate: data.endDate,
    })
  }
}
