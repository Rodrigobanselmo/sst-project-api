import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TaskActionPlanMapper } from '../../mappers/entities/task-action-plan.mapper';
import { ITaskActionPlanRepository } from './task-action-plan.types';

@Injectable()
export class TaskActionPlanRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {} satisfies Prisma.TaskProjectFindFirstArgs['include'];

    return { include };
  }

  async find(params: ITaskActionPlanRepository.FindParams): ITaskActionPlanRepository.FindReturn {
    const actionPlan = await this.prisma.riskFactorDataRec.upsert({
      where: {
        companyId: params.companyId,
        riskFactorDataId_recMedId_workspaceId: {
          riskFactorDataId: params.riskDataId,
          recMedId: params.recommendationId,
          workspaceId: params.workspaceId,
        },
      },
      create: {
        companyId: params.companyId,
        riskFactorDataId: params.riskDataId,
        recMedId: params.recommendationId,
        workspaceId: params.workspaceId,
      },
      update: { companyId: params.companyId },
    });

    return actionPlan ? TaskActionPlanMapper.toEntity(actionPlan) : null;
  }
}
