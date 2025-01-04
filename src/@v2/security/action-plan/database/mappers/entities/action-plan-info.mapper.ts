import { ActionPlanInfoEntity } from "../../../domain/entities/action-plan-info.entity"

export type IActionPlanInfoMapper = {
  companyId: string
  workspaceId: string
  validityStart: Date | null
  validityEnd: Date | null
  months_period_level_2: number
  months_period_level_3: number
  months_period_level_4: number
  months_period_level_5: number
}
export class ActionPlanInfoMapper {
  static toEntity(prisma: IActionPlanInfoMapper): ActionPlanInfoEntity {
    return new ActionPlanInfoEntity({
      validityStart: prisma.validityStart,
      validityEnd: prisma.validityEnd,
      monthsLevel_2: prisma.months_period_level_2,
      monthsLevel_3: prisma.months_period_level_3,
      monthsLevel_4: prisma.months_period_level_4,
      monthsLevel_5: prisma.months_period_level_5,
      companyId: prisma.companyId,
      workspaceId: prisma.workspaceId
    })
  }
}