import { ActionPlanInfoModel } from '@/@v2/security/action-plan/domain/models/action-plan-info/action-plan-info-find.mapper';
import { Prisma } from '@prisma/client';

export type IActionPlanInfoModelMapper = Prisma.DocumentDataGetPayload<{
  include: {
    coordinator: true;
  };
}> | null;

export class ActionPlanInfoModelMapper {
  static toModel(prisma: IActionPlanInfoModelMapper): ActionPlanInfoModel {
    return new ActionPlanInfoModel({
      validityStart: prisma?.validityStart || null,
      validityEnd: prisma?.validityEnd || null,
      periods: {
        monthsLevel_2: prisma?.months_period_level_2 || 24,
        monthsLevel_3: prisma?.months_period_level_3 || 12,
        monthsLevel_4: prisma?.months_period_level_4 || 6,
        monthsLevel_5: prisma?.months_period_level_5 || 3,
      },
      coordinator: prisma?.coordinator
        ? {
            id: prisma.coordinator.id,
            name: prisma.coordinator.name,
            email: prisma.coordinator.email,
          }
        : null,
    });
  }
}
