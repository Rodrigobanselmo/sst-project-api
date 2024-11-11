import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service'
import { Prisma } from '@prisma/client'
import { ActionPlanMapper } from '../../mappers/entities/action-plan.mapper'
import { IActionPlanRepository } from './action-plan.types'
import { asyncBatch } from '@/@v2/shared/utils/helpers/asyncBatch'


export class ActionPlanRepository implements IActionPlanRepository {
  constructor(private readonly prisma: PrismaServiceV2) { }

  static selectOptions() {
    const include = {
      comments: true
    } satisfies Prisma.RiskFactorDataRecFindFirstArgs['include']

    return { include }
  }

  async findById(params: IActionPlanRepository.FindByIdParams): IActionPlanRepository.FindByIdReturn {
    const actionPlan = await this.prisma.riskFactorDataRec.findFirst({
      where: {
        recMedId: params.recommendationId,
        riskFactorDataId: params.riskDataId,
        workspaceId: params.workspaceId,
        companyId: params.companyId
      },
      ...ActionPlanRepository.selectOptions()
    })

    return actionPlan ? ActionPlanMapper.toEntity(actionPlan) : null
  }

  async update(params: IActionPlanRepository.UpdateParams): IActionPlanRepository.UpdateReturn {
    const actionPlan = await this.prisma.riskFactorDataRec.upsert({
      where: {
        companyId: params.companyId,
        riskFactorDataId_recMedId_workspaceId: {
          riskFactorDataId: params.riskDataId,
          recMedId: params.recommendationId,
          workspaceId: params.workspaceId
        }
      },
      create: {
        companyId: params.companyId,
        riskFactorDataId: params.riskDataId,
        recMedId: params.recommendationId,
        workspaceId: params.workspaceId,
        responsibleId: params.responsibleId,
        endDate: params.validDate,
        status: params.status,
        startDate: params.startDate,
        doneDate: params.doneDate,
        canceledDate: params.canceledDate,
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
        responsibleId: params.responsibleId,
        endDate: params.validDate,
        status: params.status,
        startDate: params.startDate,
        doneDate: params.doneDate,
        canceledDate: params.canceledDate,
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
      ...ActionPlanRepository.selectOptions()
    })

    return actionPlan ? ActionPlanMapper.toEntity(actionPlan) : null
  }

  async updateMany(params: IActionPlanRepository.UpdateManyParams): IActionPlanRepository.UpdateManyReturn {
    await this.prisma.$transaction(async (tx) => {
      await asyncBatch({
        items: params,
        batchSize: 10,
        callback: async (params) => {
          await tx.riskFactorDataRec.upsert({
            where: {
              companyId: params.companyId,
              riskFactorDataId_recMedId_workspaceId: {
                riskFactorDataId: params.riskDataId,
                recMedId: params.recommendationId,
                workspaceId: params.workspaceId
              }
            },
            create: {
              companyId: params.companyId,
              riskFactorDataId: params.riskDataId,
              recMedId: params.recommendationId,
              workspaceId: params.workspaceId,
              responsibleId: params.responsibleId,
              endDate: params.validDate,
              status: params.status,
              startDate: params.startDate,
              doneDate: params.doneDate,
              canceledDate: params.canceledDate,
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
              responsibleId: params.responsibleId,
              endDate: params.validDate,
              status: params.status,
              startDate: params.startDate,
              doneDate: params.doneDate,
              canceledDate: params.canceledDate,
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