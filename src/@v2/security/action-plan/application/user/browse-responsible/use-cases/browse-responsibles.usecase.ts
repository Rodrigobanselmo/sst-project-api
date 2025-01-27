import { UserDAO } from '@/@v2/security/action-plan/database/dao/user/user.dao';
import { Injectable } from '@nestjs/common';
import { IBrowseResponsiblesUseCase } from './browse-responsibles.types';
import { ResponsibleDAO } from '@/@v2/security/action-plan/database/dao/responsible/responsible.dao';
import { ResponsibleOrderByEnum } from '@/@v2/security/action-plan/database/dao/responsible/responsible.types';
import { OrderByDirectionEnum } from '@/@v2/shared/types/order-by.types';

@Injectable()
export class BrowseResponsiblesUseCase {
  constructor(private readonly responsibleDAO: ResponsibleDAO) {}

  async execute(params: IBrowseResponsiblesUseCase.Params) {
    const data = await this.responsibleDAO.browse({
      page: params.pagination.page,
      limit: params.pagination.limit,
      orderBy: params.orderBy || [
        {
          field: ResponsibleOrderByEnum.NAME,
          order: OrderByDirectionEnum.ASC,
        },
      ],
      filters: {
        companyId: params.companyId,
        search: params.search,
      },
    });

    return data;
  }
}
