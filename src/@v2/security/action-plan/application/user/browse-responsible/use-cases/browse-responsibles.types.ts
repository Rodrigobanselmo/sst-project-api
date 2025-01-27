import { ResponsibleOrderByEnum } from '@/@v2/security/action-plan/database/dao/responsible/responsible.types';
import { IOrderBy } from '@/@v2/shared/types/order-by.types';
import { IPagination } from '@/@v2/shared/types/pagination.types';

export namespace IBrowseResponsiblesUseCase {
  export type Params = {
    companyId: string;
    orderBy?: IOrderBy<ResponsibleOrderByEnum>;
    pagination: IPagination;
    search?: string;
  };
}
