import { FormDAO } from '@/@v2/forms/database/dao/form/form.dao';
import { Injectable } from '@nestjs/common';
import { IFormUseCase } from './browse-form.types';

@Injectable()
export class BrowseFormUseCase {
  constructor(private readonly formDAO: FormDAO) {}

  async execute(params: IFormUseCase.Params) {
    const forms = await this.formDAO.browse({
      page: params.pagination.page,
      limit: params.pagination.limit,
      orderBy: params.orderBy,
      filters: {
        companyId: params.companyId,
        search: params.search,
        types: params.types,
      },
    });

    return forms;
  }
}
