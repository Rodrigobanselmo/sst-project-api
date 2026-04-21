import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, StatusEnum } from '@prisma/client';
import { syncDerivedMeasureFromDonePlanIfMissing } from '../../utils/sync-derived-measure-from-done-plan';
import { tryPromoteResidualToCurrentWhenPlanFullyImplemented } from '../../utils/try-promote-residual-to-current-when-plan-fully-implemented';
import { ActionPlanAggregate } from '../../../domain/aggregations/action-plan.aggregate';
import { ActionPlanStatusEnum } from '../../../domain/enums/action-plan-status.enum';
import { ActionPlanAggregateMapper } from '../../mappers/aggregations/action-plan.mapper';
import { IActionPlanAggregateRepository } from './action-plan-aggregate.types';

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
            recMed: {
              id: params.recommendationId,
            },
          },
        },
      },
      ...ActionPlanAggregateRepository.selectOptions(params),
    });

    return actionPlan ? ActionPlanAggregateMapper.toAggregate({ ...actionPlan, ...params }) : null;
  }

  async update(params: IActionPlanAggregateRepository.UpdateParams): IActionPlanAggregateRepository.UpdateReturn {
    await this.prisma.$transaction(async (tx) => {
      const upserted = await tx.riskFactorDataRec.upsert({
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
          responsible_updated_at: params.actionPlan.responsibleUpdatedAt,
          endDate: params.actionPlan.validDate,
          status: params.actionPlan.status as StatusEnum,
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
          responsible_updated_at: params.actionPlan.responsibleUpdatedAt,
          endDate: params.actionPlan.validDate,
          status: params.actionPlan.status as StatusEnum,
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

      await this.syncDerivedMeasureIfDone(tx, params, upserted.id);
      await tryPromoteResidualToCurrentWhenPlanFullyImplemented(tx, {
        riskFactorDataId: params.actionPlan.riskDataId,
        workspaceId: params.actionPlan.workspaceId,
        companyId: params.actionPlan.companyId,
      });
    });
  }

  async updateMany(params: IActionPlanAggregateRepository.UpdateManyParams): IActionPlanAggregateRepository.UpdateManyReturn {
    await this.prisma.$transaction(async (tx) => {
      for (const aggregate of params) {
        const upserted = await tx.riskFactorDataRec.upsert({
          where: {
            companyId: aggregate.actionPlan.companyId,
            riskFactorDataId_recMedId_workspaceId: {
              riskFactorDataId: aggregate.actionPlan.riskDataId,
              recMedId: aggregate.actionPlan.recommendationId,
              workspaceId: aggregate.actionPlan.workspaceId,
            },
          },
          create: {
            companyId: aggregate.actionPlan.companyId,
            riskFactorDataId: aggregate.actionPlan.riskDataId,
            recMedId: aggregate.actionPlan.recommendationId,
            workspaceId: aggregate.actionPlan.workspaceId,
            responsibleId: aggregate.actionPlan.responsibleId,
            responsible_updated_at: aggregate.actionPlan.responsibleUpdatedAt,
            endDate: aggregate.actionPlan.validDate,
            status: aggregate.actionPlan.status as StatusEnum,
            startDate: aggregate.actionPlan.startDate,
            doneDate: aggregate.actionPlan.doneDate,
            canceledDate: aggregate.actionPlan.canceledDate,
            comments: {
              createMany: {
                data: aggregate.comments
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
            responsibleId: aggregate.actionPlan.responsibleId,
            responsible_updated_at: aggregate.actionPlan.responsibleUpdatedAt,
            endDate: aggregate.actionPlan.validDate,
            status: aggregate.actionPlan.status as StatusEnum,
            startDate: aggregate.actionPlan.startDate,
            doneDate: aggregate.actionPlan.doneDate,
            canceledDate: aggregate.actionPlan.canceledDate,
            comments: {
              createMany: {
                data: aggregate.comments
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

        await this.syncDerivedMeasureIfDone(tx, aggregate, upserted.id);
      }

      const promoteKeys = new Set<string>();
      for (const aggregate of params) {
        promoteKeys.add(
          `${aggregate.actionPlan.riskDataId}|${aggregate.actionPlan.workspaceId}|${aggregate.actionPlan.companyId}`,
        );
      }
      for (const key of promoteKeys) {
        const [riskFactorDataId, workspaceId, companyId] = key.split('|');
        await tryPromoteResidualToCurrentWhenPlanFullyImplemented(tx, {
          riskFactorDataId,
          workspaceId,
          companyId,
        });
      }
    });
  }

  private async syncDerivedMeasureIfDone(
    tx: Prisma.TransactionClient,
    aggregate: ActionPlanAggregate,
    riskFactorDataRecId: string,
  ): Promise<void> {
    if (aggregate.actionPlan.status !== ActionPlanStatusEnum.DONE) {
      return;
    }

    await syncDerivedMeasureFromDonePlanIfMissing(tx, {
      riskFactorDataRecId,
      riskFactorDataId: aggregate.actionPlan.riskDataId,
      recommendationId: aggregate.actionPlan.recommendationId,
      workspaceId: aggregate.actionPlan.workspaceId,
      companyId: aggregate.actionPlan.companyId,
      skipIfUnlinked: false,
    });
  }
}
