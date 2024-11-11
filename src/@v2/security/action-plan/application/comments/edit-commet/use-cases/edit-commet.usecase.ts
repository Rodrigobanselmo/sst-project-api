import { LocalContext, UserContext } from '@/@v2/shared/adapters/context'
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum'
import { SharedTokens } from '@/@v2/shared/constants/tokens'
import { Inject, Injectable } from '@nestjs/common'
import { IEditCommentUseCase } from './edit-commet.types'
import { CommentRepository } from '@/@v2/security/action-plan/database/repositories/comment/comment.repository'

@Injectable()
export class EditCommentUseCase {
  constructor(
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly commentRepository: CommentRepository,
  ) { }

  async execute(params: IEditCommentUseCase.Params) {
    const loggedUser = this.context.get<UserContext>(ContextKey.USER)
    // const comment = await this.editCommentService.update({
    //   userId: loggedUser.id,
    //   comment: params.comment,
    //   ...params,
    // })

    // await this.commentRepository.update(comment)
  }
}
