import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service'
import { Prisma } from '@prisma/client'
import { asyncBatch } from '@/@v2/shared/utils/helpers/asyncBatch'
import { ICommentRepository } from './comment.types'
import { CommentMapper } from '../../mappers/entities/comment.mapper'


export class CommentRepository implements ICommentRepository {
  constructor(private readonly prisma: PrismaServiceV2) { }

  static selectOptions() {
    const include = {} satisfies Prisma.RiskFactorDataRecCommentsFindFirstArgs['include']

    return { include }
  }

  async findById(params: ICommentRepository.FindByIdParams): ICommentRepository.FindByIdReturn {
    const comment = await this.prisma.riskFactorDataRecComments.findFirst({
      where: {
        id: params.id,
        riskFactorDataRec: {
          companyId: params.companyId,
        }
      },
      ...CommentRepository.selectOptions()
    })

    return comment ? CommentMapper.toEntity(comment) : null
  }

  async update(params: ICommentRepository.UpdateParams): ICommentRepository.UpdateReturn {
    const comment = await this.prisma.riskFactorDataRecComments.update({
      where: {
        id: params.id,
      },
      data: {
        approvedAt: params.approvedAt,
        approvedById: params.approvedById,
        approvedComment: params.approvedComment,
        isApproved: params.isApproved,
      },
      ...CommentRepository.selectOptions()
    })

    return comment ? CommentMapper.toEntity(comment) : null
  }

  async updateMany(params: ICommentRepository.UpdateManyParams): ICommentRepository.UpdateManyReturn {
    await this.prisma.riskFactorDataRecComments.updateMany({
      where: {
        id: {
          in: params.ids,
        }
      },
      data: {
        approvedAt: params.approvedAt,
        approvedById: params.approvedById,
        approvedComment: params.approvedComment,
        isApproved: params.isApproved,
      },
    })

  }
}