import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { IActionPlanRepository } from './action-plan.types';

@Injectable()
export class ActionPlanRepository implements IActionPlanRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async updateResponsibleNotifiedAt(params: IActionPlanRepository.UpdateResponsibleNotifiedAtParams): IActionPlanRepository.UpdateResponsibleNotifiedAtReturn {
    await this.prisma.$transaction(async (tx) => {
      await tx.riskFactorDataRec.updateMany({
        where: {
          id: { in: params.ids },
        },
        data: {
          responsible_notified_at: new Date(),
        },
      });

      await params.callback?.();
    });
  }
}
