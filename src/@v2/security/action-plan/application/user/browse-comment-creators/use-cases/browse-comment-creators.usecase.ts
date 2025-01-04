import { UserDAO } from '@/@v2/security/action-plan/database/dao/user/user.dao';
import { Injectable } from '@nestjs/common';
import { IBrowseCommentCreatorsUseCase } from './browse-comment-creators.types';

@Injectable()
export class BrowseCommentCreatorsUseCase {
  constructor(private readonly responsibleDAO: UserDAO) {}

  async execute(params: IBrowseCommentCreatorsUseCase.Params) {
    const data = await this.responsibleDAO.browse({
      page: params.pagination.page,
      limit: params.pagination.limit,
      orderBy: params.orderBy,
      filters: {
        companyId: params.companyId,
        search: params.search,
      },
    });

    return data;
  }
}
