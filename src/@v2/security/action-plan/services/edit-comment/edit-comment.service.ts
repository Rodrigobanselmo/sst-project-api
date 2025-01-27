import { BadRequestException, Injectable } from '@nestjs/common';
import { CommentAggregateRepository } from '../../database/repositories/comment/comment-aggregate.repository';
import { IEditCommentService } from './edit-comment.service.types';

@Injectable()
export class EditCommentService {
  constructor(private readonly commentAggregateRepository: CommentAggregateRepository) {}

  async update(params: IEditCommentService.Params) {
    const aggregate = await this.commentAggregateRepository.findById({
      id: params.id,
      companyId: params.companyId,
    });

    if (!aggregate) throw new BadRequestException('Comentário não encontrado');

    const [, error] = aggregate.approve({
      approvedById: params.userId,
      approvedComment: params.approvedComment || null,
      isApproved: params.isApproved,
    });

    if (error) throw new BadRequestException(error);

    return aggregate;
  }
}
