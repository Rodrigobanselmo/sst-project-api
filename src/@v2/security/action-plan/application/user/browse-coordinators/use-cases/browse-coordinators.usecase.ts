import { UserDAO } from '@/@v2/security/action-plan/database/dao/user/user.dao';
import { Injectable } from '@nestjs/common';
import { IBrowseCoordinatorsUseCase } from './browse-coordinators.types';

@Injectable()
export class BrowseCoordinatorsUseCase {
  constructor(private readonly userDAO: UserDAO) {}

  async execute(params: IBrowseCoordinatorsUseCase.Params) {
    const data = await this.userDAO.browse({
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
