import { Injectable } from '@nestjs/common'
import { CommentAggregateRepository } from '../../database/repositories/comment/comment-aggregate.repository'
import { IEditCommentService } from './edit-comment.service.types'

@Injectable()
export class EditCommentService {
  constructor(
    private readonly commentAggregateRepository: CommentAggregateRepository,
  ) { }

  async update(params: IEditCommentService.Params) {
    const aggregare = await this.commentAggregateRepository.findById({
      id: params.id,
      companyId: params.companyId,
    })

    aggregare.approve({
      approvedById: params.userId,
      approvedComment: params.approvedComment,
      isApproved: params.isApproved,
    })

    return aggregare
  }
}
