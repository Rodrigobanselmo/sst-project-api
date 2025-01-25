import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { Inject, Injectable } from '@nestjs/common';
import { IEditCommentUseCase } from './edit-many-commets.types';
import { CommentAggregateRepository } from '@/@v2/security/action-plan/database/repositories/comment/comment-aggregate.repository';
import { EditCommentService } from '@/@v2/security/action-plan/services/edit-comment/edit-comment.service';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';

@Injectable()
export class EditManyCommentsUseCase {
  constructor(
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly editCommentService: EditCommentService,
    private readonly commentAggregateRepository: CommentAggregateRepository,
  ) {}

  async execute(params: IEditCommentUseCase.Params) {
    const loggedUser = this.context.get<UserContext>(ContextKey.USER);

    const comments = await asyncBatch({
      items: params.ids || [],
      batchSize: 10,
      callback: async (id) => {
        return this.editCommentService.update({
          id,
          isApproved: params.isApproved || false,
          approvedComment: params.approvedComment,
          companyId: params.companyId,
          userId: loggedUser.id,
        });
      },
    });

    await this.commentAggregateRepository.updateMany(comments);
  }
}
