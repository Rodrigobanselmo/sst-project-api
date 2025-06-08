import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { IActionPlanDao } from './action-plan.dao.types';
import { ActionPlanModelMapper } from '../../mappers/models/action-plan.mapper';

@Injectable()
export class ActionPlanCommunicationDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async findMany(params: IActionPlanDao.FindManyParams): IActionPlanDao.FindManyReturn {
    const actionPlan = await this.prisma.riskFactorDataRec.findMany({
      where: { id: { in: params.ids } },
      select: {
        id: true,
        endDate: true,
        status: true,
        recMed: {
          select: {
            recName: true,
          },
        },
      },
    });

    return ActionPlanModelMapper.toModels(actionPlan);
  }
}
