import { Injectable } from '@nestjs/common';
import { SubTypeDAO } from '../../../../database/dao/sub-type/sub-type.dao';
import { ISubTypeUseCase } from './browse-sub-type.types';

@Injectable()
export class BrowseSubTypeUseCase {
  constructor(private readonly subTypeDAO: SubTypeDAO) {}

  async execute(params: ISubTypeUseCase.Params) {
    const subTypes = await this.subTypeDAO.browse({
      page: params.pagination.page,
      limit: params.pagination.limit,
      orderBy: params.orderBy,
      filters: {
        types: params.types,
        search: params.search,
      },
    });

    return subTypes;
  }
}
