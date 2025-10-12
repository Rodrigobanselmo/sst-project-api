import { Injectable } from '@nestjs/common';
import { GenerateSourceDAO } from '@/@v2/security/action-plan/database/dao/generate-source/generate-source.dao';
import { IBrowseGenerateSourcesUseCase } from './browse-generate-sources.types';

@Injectable()
export class BrowseGenerateSourcesUseCase {
  constructor(private readonly generateSourceDAO: GenerateSourceDAO) {}

  async execute(params: IBrowseGenerateSourcesUseCase.Params) {
    return await this.generateSourceDAO.browse({
      page: params.pagination.page,
      limit: params.pagination.limit,
      orderBy: params.orderBy,
      filters: {
        companyId: params.companyId,
        search: params.search,
        riskIds: params.riskIds,
      },
    });
  }
}
