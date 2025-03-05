import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Prisma } from '@prisma/client';
import { IActionPlanAggregateRepository } from './action-plan-aggregate.types';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';
import { ActionPlanAggregateMapper } from '../../mappers/aggregations/action-plan.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActionPlanAggregateRepository implements IActionPlanAggregateRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions(params: IActionPlanAggregateRepository.SelectOptionsParams) {
    const select = {
      level: true,
      dataRecs: {
        where: {
          companyId: params.companyId,
          recMedId: params.recommendationId,
          riskFactorDataId: params.riskDataId,
          workspaceId: params.workspaceId,
        },
        include: {
          comments: true,
        },
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
              coordinator: true,
            },
          },
        },
      },
    } satisfies Prisma.RiskFactorDataFindFirstArgs['select'];

    return { select };
  }

  async findById(params: IActionPlanAggregateRepository.FindByIdParams): IActionPlanAggregateRepository.FindByIdReturn {
    const actionPlan = await this.prisma.riskFactorData.findFirst({
      where: {
        id: params.riskDataId,
        companyId: params.companyId,
        recs: {
          some: {
            id: params.recommendationId,
          },
        },
      },
      ...ActionPlanAggregateRepository.selectOptions(params),
    });

    return actionPlan ? ActionPlanAggregateMapper.toAggregate({ ...actionPlan, ...params }) : null;
  }

  async update(params: IActionPlanAggregateRepository.UpdateParams): IActionPlanAggregateRepository.UpdateReturn {
    await this.prisma.riskFactorDataRec.upsert({
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
        comments: {
          createMany: {
            data: params.comments
              .filter((comment) => !comment.id)
              .map((comment) => ({
                text: comment.text,
                userId: comment.commentedById,
                textType: comment.textType,
                previous_status: comment.previousStatus,
                previous_valid_date: comment.previousValidDate,
                approvedAt: comment.approvedAt,
                approvedById: comment.approvedById,
                approvedComment: comment.approvedComment,
                isApproved: comment.isApproved,
                current_status: comment.currentStatus,
                current_valid_date: comment.currentValidDate,
                type: comment.type,
              })),
          },
        },
      },
      update: {
        responsibleId: params.actionPlan.responsibleId,
        endDate: params.actionPlan.validDate,
        status: params.actionPlan.status,
        startDate: params.actionPlan.startDate,
        doneDate: params.actionPlan.doneDate,
        canceledDate: params.actionPlan.canceledDate,
        comments: {
          createMany: {
            data: params.comments
              .filter((comment) => !comment.id)
              .map((comment) => ({
                text: comment.text,
                userId: comment.commentedById,
                textType: comment.textType,
                previous_status: comment.previousStatus,
                previous_valid_date: comment.previousValidDate,
                approvedAt: comment.approvedAt,
                approvedById: comment.approvedById,
                approvedComment: comment.approvedComment,
                isApproved: comment.isApproved,
                current_status: comment.currentStatus,
                current_valid_date: comment.currentValidDate,
                type: comment.type,
              })),
          },
        },
      },
    });
  }

  async updateMany(params: IActionPlanAggregateRepository.UpdateManyParams): IActionPlanAggregateRepository.UpdateManyReturn {
    await this.prisma.$transaction(async (tx) => {
      await asyncBatch({
        items: params,
        batchSize: 10,
        callback: async (params) => {
          await tx.riskFactorDataRec.upsert({
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
              comments: {
                createMany: {
                  data: params.comments
                    .filter((comment) => !comment.id)
                    .map((comment) => ({
                      text: comment.text,
                      userId: comment.commentedById,
                      textType: comment.textType,
                      previous_status: comment.previousStatus,
                      previous_valid_date: comment.previousValidDate,
                      approvedAt: comment.approvedAt,
                      approvedById: comment.approvedById,
                      approvedComment: comment.approvedComment,
                      isApproved: comment.isApproved,
                      current_status: comment.currentStatus,
                      current_valid_date: comment.currentValidDate,
                      type: comment.type,
                    })),
                },
              },
            },
            update: {
              responsibleId: params.actionPlan.responsibleId,
              endDate: params.actionPlan.validDate,
              status: params.actionPlan.status,
              startDate: params.actionPlan.startDate,
              doneDate: params.actionPlan.doneDate,
              canceledDate: params.actionPlan.canceledDate,
              comments: {
                createMany: {
                  data: params.comments
                    .filter((comment) => !comment.id)
                    .map((comment) => ({
                      text: comment.text,
                      userId: comment.commentedById,
                      textType: comment.textType,
                      previous_status: comment.previousStatus,
                      previous_valid_date: comment.previousValidDate,
                      approvedAt: comment.approvedAt,
                      approvedById: comment.approvedById,
                      approvedComment: comment.approvedComment,
                      isApproved: comment.isApproved,
                      current_status: comment.currentStatus,
                      current_valid_date: comment.currentValidDate,
                      type: comment.type,
                    })),
                },
              },
            },
            select: { id: true },
          });
        },
      });
    });
  }
}
