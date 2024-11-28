import { Injectable } from '@nestjs/common'
import { IBrowseCommentsUseCase } from './browse-comments.types'
import { CommentDAO } from '@/@v2/security/action-plan/database/dao/comment/comment.dao'

@Injectable()
export class BrowseCommentsUseCase {
  constructor(
    private readonly commentDAO: CommentDAO
  ) { }

  async execute(params: IBrowseCommentsUseCase.Params) {
    const data = await this.commentDAO.browse({
      page: params.pagination.page,
      limit: params.pagination.limit,
      orderBy: params.orderBy,
      filters: {
        companyId: params.companyId,
        workspaceIds: params.workspaceIds,
        search: params.search,
        creatorsIds: params.creatorsIds,
        isApproved: params.isApproved,
        type: params.type,
        textType: params.textType,
      }
    })

    return data

  }
}
