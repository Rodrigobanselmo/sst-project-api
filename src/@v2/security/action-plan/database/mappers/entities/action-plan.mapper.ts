import { StatusEnum } from '@prisma/client';
import { ActionPlanEntity } from '../../../domain/entities/action-plan.entity';
import { ActionPlanStatusEnum } from '../../../domain/enums/action-plan-status.enum';
import { calculateActionPlanValidDate } from '../../../domain/functions/calculate-action-plan-valid-date.func';

export type IActionPlanEntityMapper = {
  companyId: string;
  recMedId: string;
  riskFactorDataId: string;
  workspaceId: string;
  status: StatusEnum;
  startDate?: Date | null;
  doneDate?: Date | null;
  canceledDate?: Date | null;
  responsibleId?: number | null;
  endDate?: Date | null;
};

export type IActionPlanDataEntityMapper = {
  level: number | null;
  documentData: {
    months_period_level_2: number;
    months_period_level_3: number;
    months_period_level_4: number;
    months_period_level_5: number;
    validityStart: Date | null;
  };
};

export class ActionPlanMapper {
  static toEntity(data: IActionPlanEntityMapper, info: IActionPlanDataEntityMapper): ActionPlanEntity {
    return new ActionPlanEntity({
      companyId: data.companyId,
      recommendationId: data.recMedId,
      riskDataId: data.riskFactorDataId,
      workspaceId: data.workspaceId,
      status: ActionPlanStatusEnum[data.status],
      startDate: data.startDate || null,
      doneDate: data.doneDate || null,
      canceledDate: data.canceledDate,
      responsibleId: data.responsibleId,
      validDate: calculateActionPlanValidDate({
        level: info.level,
        monthsPeriodLevel_2: info.documentData.months_period_level_2,
        monthsPeriodLevel_3: info.documentData.months_period_level_3,
        monthsPeriodLevel_4: info.documentData.months_period_level_4,
        monthsPeriodLevel_5: info.documentData.months_period_level_5,
        validityStart: info.documentData.validityStart,
        validDate: data.endDate || null,
      }),
    });
  }
}
