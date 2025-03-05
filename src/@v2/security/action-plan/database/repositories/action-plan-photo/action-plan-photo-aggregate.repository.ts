import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { IActionPlanPhotoAggregateRepository } from './action-plan-photo-aggregate.types';
import { ActionPlanPhotoAggregateMapper } from '../../mappers/aggregations/action-plan-photo.mapper';

@Injectable()
export class ActionPlanPhotoAggregateRepository implements IActionPlanPhotoAggregateRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions(params: IActionPlanPhotoAggregateRepository.SelectOptionsParams) {
    const include = {
      riskFactorData: {
        select: { level: true },
      },
      company: {
        select: {
          documentData: {
            where: {
              type: 'PGR',
              workspaceId: params.workspaceId,
            },
            select: {
              months_period_level_2: true,
              months_period_level_3: true,
              months_period_level_4: true,
              months_period_level_5: true,
              validityStart: true,
            },
          },
        },
      },
    } satisfies Prisma.RiskFactorDataRecFindFirstArgs['include'];

    return { include };
  }

  async create(params: IActionPlanPhotoAggregateRepository.CreateParams): IActionPlanPhotoAggregateRepository.CreateReturn {
    const actionPlan = await this.prisma.riskFactorDataRec.upsert({
      where: {
        companyId: params.actionPlan.companyId,
        riskFactorDataId_recMedId_workspaceId: {
          riskFactorDataId: params.actionPlan.riskDataId,
          recMedId: params.actionPlan.recommendationId,
          workspaceId: params.actionPlan.workspaceId,
        },
      },
      create: {
        companyId: params.actionPlan.companyId,
        riskFactorDataId: params.actionPlan.riskDataId,
        recMedId: params.actionPlan.recommendationId,
        workspaceId: params.actionPlan.workspaceId,
        responsibleId: params.actionPlan.responsibleId,
        endDate: params.actionPlan.validDate,
        status: params.actionPlan.status,
        startDate: params.actionPlan.startDate,
        doneDate: params.actionPlan.doneDate,
        canceledDate: params.actionPlan.canceledDate,
      },
      update: {
        responsibleId: params.actionPlan.responsibleId,
        endDate: params.actionPlan.validDate,
        status: params.actionPlan.status,
        startDate: params.actionPlan.startDate,
        doneDate: params.actionPlan.doneDate,
        canceledDate: params.actionPlan.canceledDate,
      },
      select: {
        id: true,
      },
    });

    if (!actionPlan) return null;

    const actionPlanPhoto = await this.prisma.riskFactorDataRecPhoto.create({
      data: {
        file_id: params.photo.file.id,
        is_vertical: params.photo.isVertical,
        risk_data_rec_id: actionPlan.id,
      },
      select: { id: true },
    });

    return !!actionPlanPhoto;
  }

  async update(params: IActionPlanPhotoAggregateRepository.UpdateParams): IActionPlanPhotoAggregateRepository.UpdateReturn {
    const actionPlan = await this.prisma.riskFactorDataRec.upsert({
      where: {
        companyId: params.actionPlan.companyId,
        riskFactorDataId_recMedId_workspaceId: {
          riskFactorDataId: params.actionPlan.riskDataId,
          recMedId: params.actionPlan.recommendationId,
          workspaceId: params.actionPlan.workspaceId,
        },
      },
      create: {
        companyId: params.actionPlan.companyId,
        riskFactorDataId: params.actionPlan.riskDataId,
        recMedId: params.actionPlan.recommendationId,
        workspaceId: params.actionPlan.workspaceId,
        responsibleId: params.actionPlan.responsibleId,
        endDate: params.actionPlan.validDate,
        status: params.actionPlan.status,
        startDate: params.actionPlan.startDate,
        doneDate: params.actionPlan.doneDate,
        canceledDate: params.actionPlan.canceledDate,
      },
      update: {
        responsibleId: params.actionPlan.responsibleId,
        endDate: params.actionPlan.validDate,
        status: params.actionPlan.status,
        startDate: params.actionPlan.startDate,
        doneDate: params.actionPlan.doneDate,
        canceledDate: params.actionPlan.canceledDate,
      },
      select: {
        id: true,
      },
    });

    if (!actionPlan) return null;

    const actionPlanPhoto = await this.prisma.riskFactorDataRecPhoto.update({
      where: { id: params.photo.id },
      data: {
        file_id: params.photo.file.id,
        is_vertical: params.photo.isVertical,
      },
      select: { id: true },
    });

    return !!actionPlanPhoto;
  }

  async find(params: IActionPlanPhotoAggregateRepository.FindParams): IActionPlanPhotoAggregateRepository.FindReturn {
    const actionPlanPhoto = await this.prisma.riskFactorDataRecPhoto.findFirst({
      where: {
        id: params.id,
        risk_data_rec: {
          companyId: params.companyId,
        },
      },
      include: {
        file: true,
        risk_data_rec: {
          ...ActionPlanPhotoAggregateRepository.selectOptions(params),
        },
      },
    });

    return actionPlanPhoto ? ActionPlanPhotoAggregateMapper.toAggregate(actionPlanPhoto) : null;
  }
}
