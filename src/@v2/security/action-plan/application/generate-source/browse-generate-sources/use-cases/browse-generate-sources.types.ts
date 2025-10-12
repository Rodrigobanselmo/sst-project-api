import { GenerateSourceOrderByEnum } from '@/@v2/security/action-plan/database/dao/generate-source/generate-source.types';
import { IOrderBy } from '@/@v2/shared/types/order-by.types';
import { IPagination } from '@/@v2/shared/types/pagination.types';

export namespace IBrowseGenerateSourcesUseCase {
  export type Params = {
    companyId: string;
    orderBy?: IOrderBy<GenerateSourceOrderByEnum>;
    pagination: IPagination;
    search?: string;
    riskIds?: string[];
  };
}
