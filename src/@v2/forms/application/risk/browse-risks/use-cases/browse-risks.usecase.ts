import { Injectable } from '@nestjs/common';
import { RiskDAO } from '@/@v2/forms/database/dao/risk/risk.dao';
import { IBrowseRisksUseCase } from './browse-risks.types';

@Injectable()
export class BrowseRisksUseCase {
  constructor(private readonly riskDAO: RiskDAO) {}

  async execute(params: IBrowseRisksUseCase.Params) {
    const data = await this.riskDAO.browse({
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
