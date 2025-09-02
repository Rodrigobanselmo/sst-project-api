import { IOrderBy } from '@/@v2/shared/types/order-by.types';
import { IPagination } from '@/@v2/shared/types/pagination.types';
import { RiskOrderByEnum } from '@/@v2/forms/database/dao/risk/risk.types';

export namespace IBrowseRisksUseCase {
  export type Params = {
    companyId: string;
    search?: string;
    orderBy?: IOrderBy<RiskOrderByEnum>;
    pagination: IPagination;
  };
  export type Result = {
    id: string;
    name: string;
    severity: number;
    type: string;
  };
}
