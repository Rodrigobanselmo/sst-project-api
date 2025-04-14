import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';
import { Prisma } from '@prisma/client';
import { CommentAggregateMapper } from '../../mappers/aggregations/comment.mapper';
import { ICommentAggregateRepository } from './comment-aggregate.types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentAggregateRepository implements ICommentAggregateRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {
      riskFactorDataRec: {
        include: {
          riskFactorData: {
            select: { level: true },
          },
          workspace: {
            select: {
              documentData: {
                where: {
                  type: 'PGR',
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
        },
      },
    } satisfies Prisma.RiskFactorDataRecCommentsFindFirstArgs['include'];

    return { include };
  }

  async findById(params: ICommentAggregateRepository.FindByIdParams): ICommentAggregateRepository.FindByIdReturn {
    const comment = await this.prisma.riskFactorDataRecComments.findFirst({
      where: {
        id: params.id,
        riskFactorDataRec: {
          companyId: params.companyId,
        },
      },
      ...CommentAggregateRepository.selectOptions(),
    });

    return comment ? CommentAggregateMapper.toAggregate(comment) : null;
  }

  async update(params: ICommentAggregateRepository.UpdateParams): ICommentAggregateRepository.UpdateReturn {
    const [comment] = await this.prisma.$transaction([
      this.prisma.riskFactorDataRecComments.update({
        where: {
          id: params.comment.id || '-',
          riskFactorDataRec: {
            companyId: params.actionPlan.companyId,
          },
        },
        data: {
          approvedAt: params.comment.approvedAt,
          approvedById: params.comment.approvedById,
          approvedComment: params.comment.approvedComment,
          isApproved: params.comment.isApproved,
        },
        ...CommentAggregateRepository.selectOptions(),
      }),
      this.prisma.riskFactorDataRec.update({
        where: {
          riskFactorDataId_recMedId_workspaceId: {
            riskFactorDataId: params.actionPlan.riskDataId,
            recMedId: params.actionPlan.recommendationId,
            workspaceId: params.actionPlan.workspaceId,
          },
        },
        data: {
          status: params.actionPlan.status,
          doneDate: params.actionPlan.doneDate,
          canceledDate: params.actionPlan.canceledDate,
          endDate: params.actionPlan.validDate,
        },
      }),
    ]);

    return comment ? CommentAggregateMapper.toAggregate(comment) : null;
  }

  async updateMany(params: ICommentAggregateRepository.UpdateManyParams): ICommentAggregateRepository.UpdateManyReturn {
    await this.prisma.$transaction(async (tx) => {
      await asyncBatch({
        items: params,
        batchSize: 10,
        callback: async (params) => {
          await Promise.all([
            tx.riskFactorDataRecComments.update({
              select: { id: true },
              where: {
                id: params.comment.id || '-',
                riskFactorDataRec: {
                  companyId: params.actionPlan.companyId,
                },
              },
              data: {
                approvedAt: params.comment.approvedAt,
                approvedById: params.comment.approvedById,
                approvedComment: params.comment.approvedComment,
                isApproved: params.comment.isApproved,
              },
            }),
            tx.riskFactorDataRec.update({
              select: { id: true },
              where: {
                riskFactorDataId_recMedId_workspaceId: {
                  riskFactorDataId: params.actionPlan.riskDataId,
                  recMedId: params.actionPlan.recommendationId,
                  workspaceId: params.actionPlan.workspaceId,
                },
              },
              data: {
                endDate: params.actionPlan.validDate,
                status: params.actionPlan.status,
                doneDate: params.actionPlan.doneDate,
                canceledDate: params.actionPlan.canceledDate,
              },
            }),
          ]);
        },
      });
    });
  }
}
