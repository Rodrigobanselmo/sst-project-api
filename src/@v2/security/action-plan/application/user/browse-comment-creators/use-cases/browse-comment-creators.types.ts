import { UserOrderByEnum } from '@/@v2/security/action-plan/database/dao/user/user.types';
import { IOrderBy } from '@/@v2/shared/types/order-by.types';
import { IPagination } from '@/@v2/shared/types/pagination.types';

export namespace IBrowseCommentCreatorsUseCase {
  export type Params = {
    companyId: string;
    orderBy?: IOrderBy<UserOrderByEnum>;
    pagination: IPagination;
    search?: string;
  };
}
