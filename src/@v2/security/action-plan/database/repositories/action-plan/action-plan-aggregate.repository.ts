import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service'
import { Prisma } from '@prisma/client'
import { IActionPlanAggregateRepository } from './action-plan-aggregate.types'
import { asyncBatch } from '@/@v2/shared/utils/helpers/asyncBatch'
import { ActionPlanAggregateMapper } from '../../mappers/aggregations/action-plan.mapper'


export class ActionPlanAggregateRepository implements IActionPlanAggregateRepository {
  constructor(private readonly prisma: PrismaServiceV2) { }

  static selectOptions({ workspaceId }: { workspaceId: string }) {
    const include = {
      comments: true,
      company: {
        select: {
          documentData: {
            where: {
              type: 'PGR',
              workspaceId,
            },
            select: {
              coordinator: true
            }
          }
        }
      }
    } satisfies Prisma.RiskFactorDataRecFindFirstArgs['include']

    return { include }
  }

  async findById(params: IActionPlanAggregateRepository.FindByIdParams): IActionPlanAggregateRepository.FindByIdReturn {
    const actionPlan = await this.prisma.riskFactorDataRec.findFirst({
      where: {
        recMedId: params.recommendationId,
        riskFactorDataId: params.riskDataId,
        workspaceId: params.workspaceId,
        companyId: params.companyId
      },
      ...ActionPlanAggregateRepository.selectOptions({ workspaceId: params.workspaceId })
    })

    return actionPlan ? ActionPlanAggregateMapper.toAggregate(actionPlan) : null
  }

  async update(params: IActionPlanAggregateRepository.UpdateParams): IActionPlanAggregateRepository.UpdateReturn {
    const actionPlan = await this.prisma.riskFactorDataRec.upsert({
      where: {
        companyId: params.actionPlan.companyId,
        riskFactorDataId_recMedId_workspaceId: {
          riskFactorDataId: params.actionPlan.riskDataId,
          recMedId: params.actionPlan.recommendationId,
          workspaceId: params.actionPlan.workspaceId
        }
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
            data: params.comments.filter(comment => !comment.id).map(comment => ({
              text: comment.text,
              userId: comment.commentedById,
              textType: comment.textType,
              type: comment.type
            }))
          }
        }
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
            data: params.comments.filter(comment => !comment.id).map(comment => ({
              text: comment.text,
              userId: comment.commentedById,
              textType: comment.textType,
              type: comment.type
            }))
          }
        }
      },
      ...ActionPlanAggregateRepository.selectOptions({ workspaceId: params.actionPlan.workspaceId })
    })

    return actionPlan ? ActionPlanAggregateMapper.toAggregate(actionPlan) : null
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
                workspaceId: params.actionPlan.workspaceId
              }
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
                  data: params.comments.filter(comment => !comment.id).map(comment => ({
                    text: comment.text,
                    userId: comment.commentedById,
                    textType: comment.textType,
                    type: comment.type
                  }))
                }
              }
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
                  data: params.comments.filter(comment => !comment.id).map(comment => ({
                    text: comment.text,
                    userId: comment.commentedById,
                    textType: comment.textType,
                    type: comment.type
                  }))
                }
              }
            },
            select: { id: true }
          })
        }
      })
    })
  }
}