import { FormPreliminaryLibraryDAO } from '@/@v2/forms/database/dao/form-preliminary-library/form-preliminary-library.dao';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';
import { Injectable } from '@nestjs/common';

export namespace BrowseFormPreliminaryLibraryBlocksUseCase {
  export type Params = {
    companyId: string;
    search?: string;
    page?: number;
    limit?: number;
  };
}

@Injectable()
export class BrowseFormPreliminaryLibraryBlocksUseCase {
  constructor(private readonly dao: FormPreliminaryLibraryDAO) {}

  async execute(params: BrowseFormPreliminaryLibraryBlocksUseCase.Params) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const { offSet, limit: take } = getPagination(page, limit);

    const { data, count } = await this.dao.browseBlocks({
      companyId: params.companyId,
      search: params.search,
      skip: offSet,
      take,
    });

    return { data, count, page, limit: take };
  }
}
