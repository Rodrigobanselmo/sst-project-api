import { FormPreliminaryLibraryDAO } from '@/@v2/forms/database/dao/form-preliminary-library/form-preliminary-library.dao';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';
import { Injectable } from '@nestjs/common';
import { FormPreliminaryLibraryCategoryEnum } from '@prisma/client';

export namespace BrowseFormPreliminaryLibraryQuestionsUseCase {
  export type Params = {
    companyId: string;
    category?: FormPreliminaryLibraryCategoryEnum;
    search?: string;
    page?: number;
    limit?: number;
  };
}

@Injectable()
export class BrowseFormPreliminaryLibraryQuestionsUseCase {
  constructor(private readonly dao: FormPreliminaryLibraryDAO) {}

  async execute(params: BrowseFormPreliminaryLibraryQuestionsUseCase.Params) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const { offSet, limit: take } = getPagination(page, limit);

    const { data, count } = await this.dao.browseQuestions({
      companyId: params.companyId,
      category: params.category,
      search: params.search,
      skip: offSet,
      take,
    });

    return {
      data,
      count,
      page,
      limit: take,
    };
  }
}
