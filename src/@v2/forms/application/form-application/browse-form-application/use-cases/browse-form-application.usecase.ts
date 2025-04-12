import { FormApplicationDAO } from '@/@v2/forms/database/dao/form-application/form-application.dao';
import { Injectable } from '@nestjs/common';
import { IFormApplicationUseCase } from './browse-form-application.types';

@Injectable()
export class BrowseFormApplicationUseCase {
  constructor(private readonly formApplicationDAO: FormApplicationDAO) {}

  async execute(params: IFormApplicationUseCase.Params) {
    const formApplications = await this.formApplicationDAO.browse({
      page: params.pagination.page,
      limit: params.pagination.limit,
      orderBy: params.orderBy,
      filters: {
        companyId: params.companyId,
        search: params.search,
        status: params.status,
      },
    });

    return formApplications;
  }
}
