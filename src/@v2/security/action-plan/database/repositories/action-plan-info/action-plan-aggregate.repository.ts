import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Prisma } from '@prisma/client'
import { ActionPlanInfoAggregateMapper } from '../../mappers/aggregations/action-plan-info.mapper'
import { IActionPlanInfoAggregateRepository } from './action-plan-aggregate.types'
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActionPlanInfoAggregateRepository implements IActionPlanInfoAggregateRepository {
  constructor(
    private readonly prisma: PrismaServiceV2,
  ) { }


  static selectOptions() {
    const include = {
      coordinator: true
    } satisfies Prisma.DocumentDataFindFirstArgs['include']

    return { include }
  }

  async findById(params: IActionPlanInfoAggregateRepository.FindByIdParams): IActionPlanInfoAggregateRepository.FindByIdReturn {
    const actionPlan = await this.prisma.documentData.findFirst({
      where: {
        workspaceId: params.workspaceId,
        companyId: params.companyId,
        type: 'PGR'
      },
      ...ActionPlanInfoAggregateRepository.selectOptions()
    })

    return actionPlan ? ActionPlanInfoAggregateMapper.toAggregate(actionPlan) : null
  }

  async update(params: IActionPlanInfoAggregateRepository.UpdateParams): IActionPlanInfoAggregateRepository.UpdateReturn {
    const actionPlan = await this.prisma.documentData.update({
      where: {
        type_workspaceId_companyId: {
          companyId: params.actionPlanInfo.companyId,
          workspaceId: params.actionPlanInfo.workspaceId,
          type: 'PGR'
        },
      },
      data: {
        months_period_level_2: params.actionPlanInfo.monthsLevel_2,
        months_period_level_3: params.actionPlanInfo.monthsLevel_3,
        months_period_level_4: params.actionPlanInfo.monthsLevel_4,
        months_period_level_5: params.actionPlanInfo.monthsLevel_5,
        validityStart: params.actionPlanInfo.validityStart,
        validityEnd: params.actionPlanInfo.validityEnd,
        coordinatorId: params.coordinator ? params.coordinator.id : null
      },
      ...ActionPlanInfoAggregateRepository.selectOptions()
    })

    return actionPlan ? ActionPlanInfoAggregateMapper.toAggregate(actionPlan) : null
  }
}